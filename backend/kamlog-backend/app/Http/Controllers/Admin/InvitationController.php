<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserInvitation;
use App\Models\UserPermission;
use App\Services\InvitationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InvitationController extends Controller
{
    public function __construct(
        private readonly InvitationService $invitationService,
    ) {}

    /**
     * Liste des invitations.
     * super_admin : voit toutes les invitations
     * admin       : voit uniquement les invitations pour les éditeurs
     */
    public function index(Request $request): JsonResponse
    {
        $currentUser = $request->user();
        $query = UserInvitation::with('invitedBy', 'acceptedBy');

        if ($currentUser->isSuperAdmin()) {
            // Voit tout
        } elseif ($currentUser->isAdmin()) {
            $query->where('role', 'editor');
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        $invitations = $query->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'data'    => $invitations->map(function (UserInvitation $inv) {
                return [
                    'id'          => $inv->id,
                    'email'       => $inv->email,
                    'role'        => $inv->role,
                    'permissions' => $inv->permissions,
                    'status'      => $inv->status,
                    'invited_by'  => $inv->invitedBy ? [
                        'id'   => $inv->invitedBy->id,
                        'name' => $inv->invitedBy->name,
                    ] : null,
                    'accepted_by' => $inv->acceptedBy ? [
                        'id'   => $inv->acceptedBy->id,
                        'name' => $inv->acceptedBy->name,
                    ] : null,
                    'accepted_at' => $inv->accepted_at?->toIso8601String(),
                    'expires_at'  => $inv->expires_at->toIso8601String(),
                    'created_at'  => $inv->created_at->toIso8601String(),
                ];
            }),
        ]);
    }

    /**
     * Créer une invitation et envoyer l'email.
     */
    public function store(Request $request): JsonResponse
    {
        $currentUser = $request->user();

        // Déterminer les rôles autorisés pour l'invitant
        $allowedRoles = $currentUser->isSuperAdmin()
            ? ['super_admin', 'admin', 'editor']
            : ['editor']; // Un admin ne peut inviter que des éditeurs

        $validated = $request->validate([
            'email'       => 'required|email|unique:users,email',
            'role'        => ['required', 'string', Rule::in($allowedRoles)],
            'permissions' => 'nullable|array',
        ]);

        // Vérifier s'il n'y a pas déjà une invitation en attente pour cet email
        $existingPending = UserInvitation::where('email', $validated['email'])
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->exists();

        if ($existingPending) {
            return response()->json([
                'success' => false,
                'message' => 'Une invitation est déjà en attente pour cet email.',
            ], 422);
        }

        // Construire les permissions formatées (pour les éditeurs)
        $permissions = [];
        if ($validated['role'] === 'editor' && !empty($validated['permissions'])) {
            foreach ($validated['permissions'] as $perm) {
                $section = $perm['section'] ?? null;
                if ($section && in_array($section, UserPermission::SECTIONS, true)) {
                    $permissions[$section] = [
                        'read'   => (bool) ($perm['can_read'] ?? true),
                        'write'  => (bool) ($perm['can_write'] ?? false),
                        'delete' => (bool) ($perm['can_delete'] ?? false),
                    ];
                }
            }
        }

        try {
            $invitation = $this->invitationService->createInvitation(
                $currentUser,
                $validated['email'],
                $validated['role'],
                $permissions,
            );

            return response()->json([
                'success' => true,
                'message' => 'Invitation envoyée avec succès à ' . $validated['email'],
                'data'    => [
                    'id'         => $invitation->id,
                    'email'      => $invitation->email,
                    'role'       => $invitation->role,
                    'status'     => $invitation->status,
                    'expires_at' => $invitation->expires_at->toIso8601String(),
                ],
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Révoquer une invitation en attente.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $invitation = UserInvitation::findOrFail($id);

        // Admin ne peut révoquer que les invitations d'éditeurs
        if (!$currentUser->isSuperAdmin() && $invitation->role !== 'editor') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        try {
            $this->invitationService->revokeInvitation($invitation);

            return response()->json([
                'success' => true,
                'message' => 'Invitation révoquée avec succès.',
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // ──────────────────────────────────────────────────────────
    // Routes PUBLIQUES (pas d'authentification requise)
    // ──────────────────────────────────────────────────────────

    /**
     * Valider un token d'invitation (public).
     * Le frontend appelle cette route pour pré-remplir le formulaire.
     */
    public function validateToken(string $token): JsonResponse
    {
        try {
            $invitation = $this->invitationService->validateToken($token);

            return response()->json([
                'success' => true,
                'data'    => [
                    'email'       => $invitation->email,
                    'role'        => $invitation->role,
                    'permissions' => $invitation->permissions,
                    'expires_at'  => $invitation->expires_at->toIso8601String(),
                    'invited_by'  => $invitation->invitedBy?->name ?? 'KAMLOG',
                ],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Créer le compte via un token d'invitation (public).
     */
    public function register(Request $request, string $token): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed', // Requiert password_confirmation
                'regex:/[A-Z]/',      // Au moins une majuscule
                'regex:/[0-9]/',      // Au moins un chiffre
                'regex:/[@$!%*#?&]/', // Au moins un caractère spécial
            ],
        ], [
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial (@$!%*#?&).',
        ]);

        try {
            $user = $this->invitationService->acceptInvitation(
                $token,
                $validated['name'],
                $validated['password'],
            );

            return response()->json([
                'success' => true,
                'message' => 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
                'data'    => [
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}

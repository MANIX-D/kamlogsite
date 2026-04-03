<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserPermission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs (filtrée par rôle du demandeur).
     * super_admin : voit tous les utilisateurs
     * admin       : voit uniquement les éditeurs
     */
    public function index(Request $request): JsonResponse
    {
        $currentUser = $request->user();
        $query = User::query()->withCount('permissions');

        if ($currentUser->isSuperAdmin()) {
            // Super admin voit tout
        } elseif ($currentUser->isAdmin()) {
            // Admin ne voit que les éditeurs
            $query->where('role', 'editor');
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        $users = $query->orderByDesc('created_at')->get();

        // Charger les permissions pour chaque utilisateur
        $users->load('permissions');

        return response()->json([
            'success' => true,
            'data'    => $users->map(function (User $user) {
                return [
                    'id'              => $user->id,
                    'name'            => $user->name,
                    'email'           => $user->email,
                    'role'            => $user->role,
                    'avatar'          => $user->avatar,
                    'phone'           => $user->phone,
                    'is_active'       => $user->is_active,
                    'last_login_at'   => $user->last_login_at?->toIso8601String(),
                    'created_at'      => $user->created_at->toIso8601String(),
                    'permissions'     => $user->getFormattedPermissions(),
                ];
            }),
        ]);
    }

    /**
     * Détail d'un utilisateur.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user = User::with('permissions')->findOrFail($id);

        // Vérifier les droits
        if (!$this->canManageUser($currentUser, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'role'          => $user->role,
                'avatar'        => $user->avatar,
                'phone'         => $user->phone,
                'is_active'     => $user->is_active,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'created_at'    => $user->created_at->toIso8601String(),
                'permissions'   => $user->getFormattedPermissions(),
            ],
        ]);
    }

    /**
     * Modifier un utilisateur (name, email, phone, is_active).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        if (!$this->canManageUser($currentUser, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        $validated = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'phone'     => 'sometimes|nullable|string|max:50',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès.',
            'data'    => $user->fresh()->load('permissions'),
        ]);
    }

    /**
     * Activer/désactiver un utilisateur.
     */
    public function toggleActive(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        if (!$this->canManageUser($currentUser, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        // Empêcher de se désactiver soi-même
        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas désactiver votre propre compte.',
            ], 422);
        }

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'Utilisateur activé.' : 'Utilisateur désactivé.',
            'data'    => $user,
        ]);
    }

    /**
     * Mettre à jour les permissions d'un éditeur.
     */
    public function updatePermissions(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        if (!$this->canManageUser($currentUser, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        if (!$user->isEditor()) {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les éditeurs ont des permissions configurables.',
            ], 422);
        }

        $validated = $request->validate([
            'permissions'             => 'required|array',
            'permissions.*.section'   => ['required', 'string', Rule::in(UserPermission::SECTIONS)],
            'permissions.*.can_read'  => 'required|boolean',
            'permissions.*.can_write' => 'required|boolean',
            'permissions.*.can_delete'=> 'required|boolean',
        ]);

        // Supprimer les anciennes permissions
        $user->permissions()->delete();

        // Créer les nouvelles permissions
        foreach ($validated['permissions'] as $perm) {
            // Ne créer que si au moins un droit est accordé
            if ($perm['can_read'] || $perm['can_write'] || $perm['can_delete']) {
                UserPermission::create([
                    'user_id'    => $user->id,
                    'section'    => $perm['section'],
                    'can_read'   => $perm['can_read'],
                    'can_write'  => $perm['can_write'],
                    'can_delete' => $perm['can_delete'],
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Permissions mises à jour avec succès.',
            'data'    => $user->fresh()->load('permissions'),
        ]);
    }

    /**
     * Supprimer (soft delete) un utilisateur.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        if (!$this->canManageUser($currentUser, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé.',
            ], 403);
        }

        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 422);
        }

        // Révoquer les tokens actifs
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }

    /**
     * Vérifier si le demandeur peut gérer l'utilisateur cible.
     * 
     * - super_admin peut gérer tout le monde
     * - admin peut gérer uniquement les éditeurs
     * - editor ne peut gérer personne
     */
    private function canManageUser(User $manager, User $target): bool
    {
        if ($manager->isSuperAdmin()) {
            return true;
        }

        if ($manager->isAdmin() && !$manager->isSuperAdmin()) {
            return $target->isEditor();
        }

        return false;
    }
}

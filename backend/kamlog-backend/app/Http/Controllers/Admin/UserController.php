<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs.
     * super_admin : voit tous les utilisateurs
     * admin       : voit tous les utilisateurs (mais ne peut pas inviter)
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $users->map(function (User $user) {
                return [
                    'id'            => $user->id,
                    'name'          => $user->name,
                    'email'         => $user->email,
                    'role'          => $user->role,
                    'avatar'        => $user->avatar,
                    'phone'         => $user->phone,
                    'is_active'     => $user->is_active,
                    'last_login_at' => $user->last_login_at?->toIso8601String(),
                    'created_at'    => $user->created_at->toIso8601String(),
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
        $user        = User::findOrFail($id);

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
            ],
        ]);
    }

    /**
     * Modifier un utilisateur (name, email, phone, is_active).
     * Un admin ne peut modifier que son propre profil via la section Paramètres.
     * Le super_admin peut modifier n'importe qui.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user        = User::findOrFail($id);

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

        // Invalider le cache du dashboard
        Cache::forget('dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès.',
            'data'    => $user->fresh(),
        ]);
    }

    /**
     * Activer/désactiver un utilisateur.
     * Réservé au super_admin.
     */
    public function toggleActive(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user        = User::findOrFail($id);

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

        $user->is_active = !$user->is_active;
        $user->save();

        // Invalider le cache du dashboard
        Cache::forget('dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'Utilisateur activé.' : 'Utilisateur désactivé.',
            'data'    => $user,
        ]);
    }

    /**
     * Supprimer (soft delete) un utilisateur.
     * Réservé au super_admin.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        $user        = User::findOrFail($id);

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

        // Révoquer les tokens actifs avant suppression
        $user->tokens()->delete();
        $user->delete();

        // Invalider le cache du dashboard
        Cache::forget('dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }

    /**
     * Vérifier si le demandeur peut gérer l'utilisateur cible.
     *
     * - super_admin peut gérer tout le monde sauf lui-même pour la suppression
     * - admin ne peut gérer personne d'autre (la gestion de son propre profil
     *   passe par la section Paramètres → ProfileController)
     */
    private function canManageUser(User $manager, User $target): bool
    {
        if ($manager->isSuperAdmin()) {
            return true;
        }

        // Un admin peut uniquement consulter les données (lecture)
        // mais pas modifier d'autres comptes
        return false;
    }
}

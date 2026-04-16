<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * Récupérer le profil complet de l'administrateur connecté.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

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
     * Mettre à jour les informations du profil (nom et/ou email).
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'  => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
        ], [
            'name.required'  => 'Le nom est requis.',
            'name.max'       => 'Le nom ne peut pas dépasser 255 caractères.',
            'email.required' => 'L\'email est requis.',
            'email.email'    => 'L\'adresse email n\'est pas valide.',
            'email.unique'   => 'Cette adresse email est déjà utilisée.',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès.',
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'phone' => $user->phone,
                'avatar'=> $user->avatar,
            ],
        ]);
    }

    /**
     * Mettre à jour le mot de passe de l'administrateur.
     * Révoque le token actuel et en génère un nouveau.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&]/',
                'different:current_password',
            ],
        ], [
            'current_password.required' => 'Le mot de passe actuel est requis.',
            'password.required'         => 'Le nouveau mot de passe est requis.',
            'password.min'              => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.regex'            => 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial (@$!%*#?&).',
            'password.confirmed'        => 'Les mots de passe ne correspondent pas.',
            'password.different'        => 'Le nouveau mot de passe doit être différent de l\'actuel.',
        ]);

        // Vérifier le mot de passe actuel
        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Révoquer tous les tokens existants (y compris le token actuel)
        $user->tokens()->delete();

        // Créer un nouveau token avec les mêmes abilities
        $abilities = $this->getAbilitiesForRole($user->role);
        $newToken  = $user->createToken('admin-token', $abilities, now()->addDay())->plainTextToken;

        AuthLogService::logTokenRefresh($user->email, $request->ip());

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe mis à jour avec succès.',
            'data'    => [
                'token'     => $newToken,
                'abilities' => $abilities,
            ],
        ]);
    }

    /**
     * Retourner les abilities selon le rôle.
     */
    private function getAbilitiesForRole(string $role): array
    {
        return match ($role) {
            'super_admin' => ['admin:*', 'users:*', 'content:*', 'settings:*'],
            'admin'       => ['admin:read', 'admin:update', 'content:*'],
            default       => ['admin:read'],
        };
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\AuthLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Login admin et génération du token
     * 
     * Note: Le rate limiting est géré par le middleware throttle:login
     * défini dans AppServiceProvider (5/min par email+IP, 15/h par IP)
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $admin = User::where('email', $request->email)->first();

        // Utiliser hash_equals pour éviter les timing attacks
        $validCredentials = $admin && Hash::check($request->password, $admin->password);

        if (!$validCredentials) {
            AuthLogService::logFailedLogin($request->email, $request->ip(), 'invalid_credentials');
            
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Vérifier si l'admin est actif
        if (!$admin->is_active) {
            AuthLogService::logFailedLogin($request->email, $request->ip(), 'account_disabled');
            
            throw ValidationException::withMessages([
                'email' => ['Ce compte administrateur est désactivé.'],
            ]);
        }

        // Vérifier que le rôle est valide
        if (!in_array($admin->role, ['super_admin', 'admin', 'editor'])) {
            AuthLogService::logFailedLogin($request->email, $request->ip(), 'invalid_role');
            
            throw ValidationException::withMessages([
                'email' => ['Rôle administrateur invalide.'],
            ]);
        }

        // Mettre à jour les informations de connexion
        $admin->updateLastLogin($request->ip());

        // Logger la connexion réussie
        AuthLogService::logSuccessfulLogin($admin->email, $request->ip(), $admin->role);

        // Créer le token avec les abilities basées sur le rôle
        $abilities = $this->getAbilitiesForRole($admin->role);
        $token = $admin->createToken('admin-token', $abilities, now()->addDay())->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                    'avatar' => $admin->avatar,
                    'phone' => $admin->phone,
                ],
                'token' => $token,
                'abilities' => $abilities,
                'permissions' => $admin->getFormattedPermissions(),
            ],
        ], 200);
    }

    /**
     * Logout admin et révocation du token
     */
    public function logout(Request $request): JsonResponse
    {
        $admin = $request->user();
        $currentToken = $admin->currentAccessToken();
        
        if ($currentToken) {
            $currentToken->delete();
        }

        AuthLogService::logLogout($admin->email, $request->ip(), false);

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie',
        ], 200);
    }

    /**
     * Révoquer tous les tokens de l'admin
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $admin = $request->user();
        
        // Révoquer tous les tokens
        $admin->tokens()->delete();

        AuthLogService::logLogout($admin->email, $request->ip(), true);

        return response()->json([
            'success' => true,
            'message' => 'Tous les tokens ont été révoqués',
        ], 200);
    }

    /**
     * Récupérer les informations de l'admin connecté
     */
    public function me(Request $request): JsonResponse
    {
        $admin = $request->user();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'avatar' => $admin->avatar,
                'phone' => $admin->phone,
                'is_active' => $admin->is_active,
                'last_login_at' => $admin->last_login_at,
                'created_at' => $admin->created_at,
                'permissions' => $admin->getFormattedPermissions(),
            ],
        ], 200);
    }

    /**
     * Rafraîchir le token
     */
    public function refresh(Request $request): JsonResponse
    {
        $admin = $request->user();
        
        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
            ], 404);
        }

        // Vérifier que le rôle est toujours valide
        if (!in_array($admin->role, ['super_admin', 'admin', 'editor'])) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle administrateur invalide',
            ], 403);
        }

        // Vérifier que le compte est toujours actif
        if (!$admin->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé',
            ], 403);
        }
        
        // Révoquer le token actuel
        $currentToken = $request->user()->currentAccessToken();
        if ($currentToken) {
            $currentToken->delete();
        }

        // Créer un nouveau token
        $abilities = $this->getAbilitiesForRole($admin->role);
        $token = $admin->createToken('admin-token', $abilities, now()->addDay())->plainTextToken;

        AuthLogService::logTokenRefresh($admin->email, $request->ip());

        return response()->json([
            'success' => true,
            'message' => 'Token rafraîchi',
            'data' => [
                'token' => $token,
                'abilities' => $abilities,
            ],
        ], 200);
    }

    /**
     * Obtenir les abilities selon le rôle
     */
    private function getAbilitiesForRole(string $role): array
    {
        return match ($role) {
            'super_admin' => [
                'admin:*',
                'users:*',
                'content:*',
                'settings:*',
            ],
            'admin' => [
                'admin:read',
                'admin:update',
                'users:*',
                'content:*',
            ],
            'editor' => [
                'admin:read',
                'content:*',
            ],
            default => ['admin:read'],
        };
    }
}

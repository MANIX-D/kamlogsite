<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEditor
{
    /**
     * Vérifier que l'utilisateur a au moins le rôle editor
     * (editor, admin ou super_admin)
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé',
            ], 403);
        }

        // Tous les utilisateurs authentifiés avec un rôle valide peuvent passer
        if (!in_array($user->role, ['editor', 'admin', 'super_admin'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Rôle invalide.',
            ], 403);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Vérifier que l'utilisateur a l'un des rôles spécifiés
     * 
     * Usage: ->middleware('role:super_admin,admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
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

        // Si aucun rôle spécifié, autoriser tout utilisateur authentifié
        if (empty($roles)) {
            return $next($request);
        }

        // Vérifier si l'utilisateur a l'un des rôles requis
        if (!$user->hasAnyRole($roles)) {
            $message = app()->environment('local') 
                ? 'Accès refusé. Rôles requis: ' . implode(', ', $roles)
                : 'Accès refusé. Permissions insuffisantes.';

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 403);
        }

        return $next($request);
    }
}

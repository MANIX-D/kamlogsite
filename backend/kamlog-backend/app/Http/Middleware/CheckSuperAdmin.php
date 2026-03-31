<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSuperAdmin
{
    /**
     * Vérifier que l'utilisateur est super_admin
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

        if (!$user->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Permissions super_admin requises.',
            ], 403);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use App\Services\AuthLogService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminAbility
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $ability): Response
    {
        $user = $request->user();

        // Vérifier si l'utilisateur est authentifié
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], 401);
        }

        // Vérifier si l'utilisateur est actif
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé',
            ], 403);
        }

        // Vérifier si l'utilisateur a l'ability requise
        if (!$user->tokenCan($ability) && !$user->tokenCan('admin:*')) {
            // Logger l'accès refusé
            AuthLogService::logAccessDenied(
                $user->email,
                $request->ip(),
                'insufficient_ability',
                $request->path()
            );

            // Ne pas exposer l'ability requise en production
            $message = app()->environment('local') 
                ? 'Accès refusé. Permission requise: ' . $ability
                : 'Accès refusé. Permissions insuffisantes.';

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 403);
        }

        return $next($request);
    }
}

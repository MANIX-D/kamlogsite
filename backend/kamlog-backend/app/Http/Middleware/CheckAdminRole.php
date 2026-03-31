<?php

namespace App\Http\Middleware;

use App\Services\AuthLogService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
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

        // Si aucun rôle spécifique n'est requis, autoriser
        if (empty($roles)) {
            return $next($request);
        }

        // Vérifier si l'utilisateur a l'un des rôles requis
        if (!in_array($user->role, $roles, true)) {
            // Logger l'accès refusé
            AuthLogService::logAccessDenied(
                $user->email,
                $request->ip(),
                'insufficient_role',
                $request->path()
            );

            // Ne pas exposer les rôles requis en production
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

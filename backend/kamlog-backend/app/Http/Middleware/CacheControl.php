<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheControl
{
    /**
     * Ajouter les headers de cache appropriés
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Ne pas cacher les requêtes authentifiées
        if ($request->user()) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
            return $response;
        }

        // Cache pour les requêtes GET publiques
        if ($request->isMethod('GET') && $response->isSuccessful()) {
            // Déterminer la durée de cache selon l'endpoint
            $cacheTime = $this->getCacheTime($request);

            if ($cacheTime > 0) {
                $response->headers->set('Cache-Control', 'public, max-age=' . $cacheTime);
                $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + $cacheTime) . ' GMT');
            }
        }

        return $response;
    }

    /**
     * Déterminer la durée de cache selon l'endpoint
     */
    private function getCacheTime(Request $request): int
    {
        $path = $request->path();

        // Services, Partners, Infrastructures : 1 heure
        if (preg_match('#^api/v1/(services|partners|infrastructures)#', $path)) {
            return 3600;
        }

        // News : 15 minutes
        if (preg_match('#^api/v1/news#', $path)) {
            return 900;
        }

        // Jobs, Announcements : 30 minutes
        if (preg_match('#^api/v1/(jobs|announcements)#', $path)) {
            return 1800;
        }

        // Pas de cache par défaut
        return 0;
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheControl
{
    /**
     * Cache time rules: [regex pattern => [max-age, stale-while-revalidate]]
     * Compiled once, matched in order.
     */
    private const CACHE_RULES = [
        '#^api/v1/(services|partners|infrastructures)$#' => [3600, 600],
        '#^api/v1/(services|partners|infrastructures)/\d+$#' => [3600, 300],
        '#^api/v1/news#' => [900, 300],
        '#^api/v1/(jobs|announcements)#' => [1800, 600],
    ];

    /**
     * Ajouter les headers de cache appropriés
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Ne pas cacher les requêtes authentifiées
        if ($request->user()) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, private, must-revalidate, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            return $response;
        }

        // Cache pour les requêtes GET publiques
        if ($request->isMethod('GET') && $response->isSuccessful()) {
            [$maxAge, $staleRevalidate] = $this->getCacheTimes($request);

            if ($maxAge > 0) {
                // s-maxage for CDN/reverse proxy, max-age for browser
                $response->headers->set(
                    'Cache-Control',
                    "public, max-age={$maxAge}, s-maxage={$maxAge}, stale-while-revalidate={$staleRevalidate}"
                );
            }
        }

        return $response;
    }

    /**
     * Déterminer la durée de cache [max-age, stale-while-revalidate] selon l'endpoint
     */
    private function getCacheTimes(Request $request): array
    {
        $path = $request->path();

        foreach (self::CACHE_RULES as $pattern => $times) {
            if (preg_match($pattern, $path)) {
                return $times;
            }
        }

        return [0, 0];
    }
}

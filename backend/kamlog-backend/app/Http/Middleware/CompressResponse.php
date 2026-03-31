<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompressResponse
{
    /**
     * Compresser les réponses JSON avec gzip si le client le supporte.
     * Réduit la bande passante de 60-80% pour les réponses JSON volumineuses.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Ne compresser que les réponses JSON réussies
        if (!$response instanceof JsonResponse) {
            return $response;
        }

        // Vérifier que le client accepte gzip
        if (!str_contains($request->header('Accept-Encoding', ''), 'gzip')) {
            return $response;
        }

        // Ne pas compresser les petites réponses (< 1KB — overhead gzip non rentable)
        $content = $response->getContent();
        if ($content === false || strlen($content) < 1024) {
            return $response;
        }

        // Compresser
        $compressed = gzencode($content, 6);

        if ($compressed === false) {
            return $response;
        }

        // Ne retourner la version compressée que si elle est plus petite
        if (strlen($compressed) >= strlen($content)) {
            return $response;
        }

        $response->setContent($compressed);
        $response->headers->set('Content-Encoding', 'gzip');
        $response->headers->set('Content-Length', (string) strlen($compressed));
        $response->headers->set('Vary', 'Accept-Encoding');

        return $response;
    }
}

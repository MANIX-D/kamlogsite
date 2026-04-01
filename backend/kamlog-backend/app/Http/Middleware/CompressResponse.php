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
     *
     * Adaptive compression: level 1 for large payloads (speed), level 6 for smaller ones (ratio).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Ne compresser que les réponses JSON réussies
        if (!$response instanceof JsonResponse) {
            return $response;
        }

        // Vérifier que le client accepte gzip
        $acceptEncoding = $request->header('Accept-Encoding', '');
        if (!str_contains($acceptEncoding, 'gzip')) {
            return $response;
        }

        // Ne pas compresser les petites réponses (< 1KB — overhead gzip non rentable)
        $content = $response->getContent();
        if ($content === false || ($contentLength = strlen($content)) < 1024) {
            return $response;
        }

        // Adaptive: large payloads (>50KB) use level 1 (fast), smaller use level 4 (balanced)
        $level = $contentLength > 51200 ? 1 : 4;
        $compressed = gzencode($content, $level);

        if ($compressed === false) {
            return $response;
        }

        // Ne retourner la version compressée que si elle est plus petite
        if (strlen($compressed) >= $contentLength) {
            return $response;
        }

        $response->setContent($compressed);
        $response->headers->set('Content-Encoding', 'gzip');
        $response->headers->set('Content-Length', (string) strlen($compressed));
        $response->headers->set('Vary', 'Accept-Encoding');

        return $response;
    }
}

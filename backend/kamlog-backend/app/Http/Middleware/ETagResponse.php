<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ETagResponse
{
    /**
     * Ajouter un ETag aux réponses GET pour permettre le cache conditionnel (304 Not Modified).
     * Le client envoie If-None-Match, et si le contenu n'a pas changé, on renvoie 304 sans body.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Uniquement pour les GET réussies non-authentifiées
        if (!$request->isMethod('GET') || !$response->isSuccessful()) {
            return $response;
        }

        // Ne pas ajouter d'ETag pour les requêtes authentifiées (données personnalisées)
        if ($request->user()) {
            return $response;
        }

        // Ne pas ajouter d'ETag si déjà présent ou si la réponse est streamée
        if ($response->headers->has('ETag')) {
            return $response;
        }

        $content = $response->getContent();

        if ($content === false || $content === '') {
            return $response;
        }

        // xxh128 : plus rapide que crc32b avec moins de collisions sur de grands payloads
        $etag = '"' . hash('xxh128', $content) . '"';
        $response->headers->set('ETag', $etag);

        // Vérifier If-None-Match du client
        $ifNoneMatch = $request->header('If-None-Match');

        if ($ifNoneMatch && $ifNoneMatch === $etag) {
            $response->setStatusCode(304);
            $response->setContent('');
        }

        return $response;
    }
}

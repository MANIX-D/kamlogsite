<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    /**
     * Logger les requêtes API pour monitoring
     * 
     * - Logging complet si LOG_API_REQUESTS=true
     * - Slow requests (>2s) et erreurs 5xx sont toujours loggées
     * - X-Response-Time header supprimé en production par AddSecurityHeaders
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = round((microtime(true) - $startTime) * 1000, 2);

        $statusCode = $response->getStatusCode();
        $isSlowRequest = $duration > 2000;
        $isServerError = $statusCode >= 500;

        // Toujours logger les requêtes lentes et les erreurs serveur
        if ($isSlowRequest || $isServerError) {
            Log::channel('api')->warning($isServerError ? 'API Server Error' : 'Slow API Request', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
                'user_id' => $request->user()?->id,
                'status' => $statusCode,
                'duration_ms' => $duration,
            ]);
        }
        // Logger toutes les requêtes si activé (attention: volume élevé en prod)
        elseif (config('app.log_api_requests', false)) {
            Log::channel('api')->info('API Request', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
                'user_id' => $request->user()?->id,
                'status' => $statusCode,
                'duration_ms' => $duration,
            ]);
        }

        // Temps de réponse dans les headers (supprimé en prod par AddSecurityHeaders)
        $response->headers->set('X-Response-Time', $duration . 'ms');

        return $response;
    }
}

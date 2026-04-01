<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Trust proxies (Nginx, Cloudflare, AWS ALB, etc.)
        $middleware->trustProxies(
            at: env('TRUSTED_PROXIES', '*'),
            headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
                     \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
                     \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
                     \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
                     \Illuminate\Http\Request::HEADER_X_FORWARDED_AWS_ELB,
        );

        // Alias pour les middlewares personnalisés
        $middleware->alias([
            'admin.role' => \App\Http\Middleware\CheckAdminRole::class,
            'admin.ability' => \App\Http\Middleware\CheckAdminAbility::class,
            'role' => \App\Http\Middleware\CheckRole::class,
            'role.super_admin' => \App\Http\Middleware\CheckSuperAdmin::class,
            'role.admin' => \App\Http\Middleware\CheckAdmin::class,
            'role.editor' => \App\Http\Middleware\CheckEditor::class,
            'cache.control' => \App\Http\Middleware\CacheControl::class,
            'log.api' => \App\Http\Middleware\LogApiRequests::class,
            'storage.quota' => \App\Http\Middleware\CheckStorageQuota::class,
            'compress' => \App\Http\Middleware\CompressResponse::class,
            'etag' => \App\Http\Middleware\ETagResponse::class,
        ]);

        // Middlewares globaux pour l'API
        // Ordre : sécurité → sanitize → logging → cache → compression → ETag
        $middleware->api(prepend: [
            \App\Http\Middleware\AddSecurityHeaders::class,
            \App\Http\Middleware\SanitizeInput::class,
            \App\Http\Middleware\LogApiRequests::class,
            \App\Http\Middleware\CacheControl::class,
            \App\Http\Middleware\CompressResponse::class,
            \App\Http\Middleware\ETagResponse::class,
        ]);

        // Configuration CORS
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Stateful API (pour Sanctum)
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // ── Toutes les exceptions API retournent du JSON structuré ──
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié',
                ], 401);
            }
        });

        $exceptions->render(function (NotFoundHttpException|ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ressource non trouvée',
                ], 404);
            }
        });

        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                $retryAfter = $e->getHeaders()['Retry-After'] ?? null;
                $response = [
                    'success' => false,
                    'message' => 'Trop de requêtes. Veuillez patienter.',
                ];
                if ($retryAfter) {
                    $response['retry_after'] = (int) $retryAfter;
                }
                return response()->json($response, 429);
            }
        });

        // ── Catch-all : ne jamais exposer de stack trace en production ──
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                // Les HttpException ont un code de statut dédié
                if ($e instanceof HttpException) {
                    return response()->json([
                        'success' => false,
                        'message' => $e->getMessage() ?: 'Erreur HTTP',
                    ], $e->getStatusCode());
                }

                // En production : message générique, pas de stack trace
                $isProduction = app()->isProduction();

                \Log::error('API Exception', [
                    'exception' => get_class($e),
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'ip' => $request->ip(),
                    'user_id' => $request->user()?->id,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => $isProduction
                        ? 'Une erreur interne est survenue.'
                        : $e->getMessage(),
                    ...(!$isProduction ? [
                        'debug' => [
                            'exception' => get_class($e),
                            'file' => $e->getFile(),
                            'line' => $e->getLine(),
                        ],
                    ] : []),
                ], 500);
            }
        });

    })->create();

<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Connection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureProduction();
        $this->configureModels();
        $this->configureDatabase();
        $this->configureRateLimiting();
    }

    /**
     * Production-specific optimizations
     */
    protected function configureProduction(): void
    {
        // Force HTTPS URL generation behind reverse proxy / load balancer
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }
    }

    /**
     * Configurer les protections Eloquent
     */
    protected function configureModels(): void
    {
        // Empêcher le lazy loading (N+1) — lève une exception en dev, log en prod
        Model::preventLazyLoading(!app()->isProduction());

        // En production, log les violations de lazy loading au lieu de crasher
        if (app()->isProduction()) {
            Model::handleLazyLoadingViolationUsing(function (Model $model, string $relation) {
                Log::warning('Lazy loading violation', [
                    'model' => get_class($model),
                    'relation' => $relation,
                ]);
            });
        }

        // Empêcher l'assignation de masse silencieuse
        Model::preventSilentlyDiscardingAttributes(!app()->isProduction());

        // Empêcher l'accès à des attributs inexistants
        Model::preventAccessingMissingAttributes(!app()->isProduction());
    }

    /**
     * Configurer le monitoring de base de données
     */
    protected function configureDatabase(): void
    {
        // Log slow queries in production only (avoids overhead in dev)
        if (app()->isProduction()) {
            // Aggregate alert: queries taking > 500ms total per request
            DB::whenQueryingForLongerThan(500, function (Connection $connection) {
                Log::channel('query')->warning('Slow database queries detected', [
                    'connection' => $connection->getName(),
                ]);
            });

            // Individual slow query logging (> 1s)
            DB::listen(function ($query) {
                if ($query->time > 1000) {
                    Log::channel('query')->warning('Slow query', [
                        'sql' => $query->sql,
                        'time_ms' => $query->time,
                        'connection' => $query->connectionName,
                    ]);
                }
            });
        }
    }

    /**
     * Configurer le rate limiting avancé par type de route
     */
    protected function configureRateLimiting(): void
    {
        // ── Global API : 60 req/min par IP pour les visiteurs, 120 pour les admins ──
        RateLimiter::for('api', function (Request $request) {
            $user = $request->user();

            if ($user) {
                return Limit::perMinute(120)->by('user:' . $user->id);
            }

            return Limit::perMinute(60)->by('ip:' . $request->ip());
        });

        // ── Authentification : protection brute force ──
        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->input('email', '');
            $key = 'login:' . mb_strtolower($email) . '|' . $request->ip();

            return [
                // 5 tentatives par minute par combinaison email+IP
                Limit::perMinute(5)->by($key)->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'Trop de tentatives de connexion. Réessayez dans quelques minutes.',
                    ], 429);
                }),
                // 15 tentatives par heure par IP (toutes emails confondues)
                Limit::perHour(15)->by('login-ip:' . $request->ip())->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'Trop de tentatives depuis cette adresse. Réessayez plus tard.',
                    ], 429);
                }),
            ];
        });

        // ── Formulaires publics : soumissions limitées ──
        RateLimiter::for('public-form', function (Request $request) {
            return [
                // 3 soumissions par heure par IP
                Limit::perHour(3)->by('form:' . $request->ip())->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'Vous avez atteint la limite de soumissions. Réessayez dans une heure.',
                    ], 429);
                }),
                // 10 soumissions par jour par IP
                Limit::perDay(10)->by('form-day:' . $request->ip())->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'Limite quotidienne atteinte. Réessayez demain.',
                    ], 429);
                }),
            ];
        });

        // ── Upload de fichiers ──
        RateLimiter::for('uploads', function (Request $request) {
            $user = $request->user();

            if ($user) {
                return Limit::perHour(50)->by('upload-user:' . $user->id);
            }

            return Limit::perDay(5)->by('upload-ip:' . $request->ip())->response(function () {
                return response()->json([
                    'success' => false,
                    'message' => 'Limite d\'uploads atteinte pour aujourd\'hui.',
                ], 429);
            });
        });

        // ── Admin write operations : CRUD limité pour éviter les abus ──
        RateLimiter::for('admin-write', function (Request $request) {
            $user = $request->user();

            if (!$user) {
                return Limit::none();
            }

            // Super admin : 200 écritures/min
            if ($user->isSuperAdmin()) {
                return Limit::perMinute(200)->by('admin-write:' . $user->id);
            }

            // Admin : 60 écritures/min
            return Limit::perMinute(60)->by('admin-write:' . $user->id);
        });
    }
}

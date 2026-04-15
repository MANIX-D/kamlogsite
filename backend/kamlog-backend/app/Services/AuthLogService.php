<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AuthLogService
{
    /**
     * Logger une tentative de connexion réussie
     */
    public static function logSuccessfulLogin(string $email, string $ip, string $role): void
    {
        Log::channel('auth')->info('Connexion réussie', [
            'email' => $email,
            'ip' => $ip,
            'role' => $role,
            'timestamp' => now()->toIso8601String(),
            'user_agent' => request()->userAgent(),
        ]);

        // Incrémenter les métriques
        self::incrementMetric('login_success');
        self::incrementMetric("login_success_role_{$role}");
    }

    /**
     * Logger une tentative de connexion échouée
     */
    public static function logFailedLogin(string $email, string $ip, string $reason = 'invalid_credentials'): void
    {
        Log::channel('auth')->warning('Tentative de connexion échouée', [
            'email' => $email,
            'ip' => $ip,
            'reason' => $reason,
            'timestamp' => now()->toIso8601String(),
            'user_agent' => request()->userAgent(),
        ]);

        // Incrémenter les métriques
        self::incrementMetric('login_failed');
        self::incrementMetric("login_failed_{$reason}");

        // Détecter les attaques potentielles
        self::detectSuspiciousActivity($ip, $email);
    }

    /**
     * Logger une déconnexion
     */
    public static function logLogout(string $email, string $ip, bool $allDevices = false): void
    {
        Log::channel('auth')->info('Déconnexion', [
            'email' => $email,
            'ip' => $ip,
            'all_devices' => $allDevices,
            'timestamp' => now()->toIso8601String(),
        ]);

        self::incrementMetric('logout');
        if ($allDevices) {
            self::incrementMetric('logout_all_devices');
        }
    }

    /**
     * Logger un refresh de token
     */
    public static function logTokenRefresh(string $email, string $ip): void
    {
        Log::channel('auth')->info('Token rafraîchi', [
            'email' => $email,
            'ip' => $ip,
            'timestamp' => now()->toIso8601String(),
        ]);

        self::incrementMetric('token_refresh');
    }

    /**
     * Logger un accès refusé
     */
    public static function logAccessDenied(string $email, string $ip, string $reason, ?string $route = null): void
    {
        Log::channel('security')->warning('Accès refusé', [
            'email' => $email,
            'ip' => $ip,
            'reason' => $reason,
            'route' => $route ?? request()->path(),
            'timestamp' => now()->toIso8601String(),
        ]);

        self::incrementMetric('access_denied');
        self::incrementMetric("access_denied_{$reason}");
    }

    /**
     * Logger un rate limiting
     */
    public static function logRateLimitHit(string $ip, string $action, int $secondsUntilAvailable): void
    {
        Log::channel('security')->warning('Rate limit atteint', [
            'ip' => $ip,
            'action' => $action,
            'retry_after' => $secondsUntilAvailable,
            'timestamp' => now()->toIso8601String(),
        ]);

        self::incrementMetric('rate_limit_hit');
        self::incrementMetric("rate_limit_hit_{$action}");
    }

    /**
     * Détecter une activité suspecte
     */
    protected static function detectSuspiciousActivity(string $ip, string $email): void
    {
        $key = "suspicious_activity:{$ip}";
        $attempts = Cache::get($key, 0);
        $attempts++;

        Cache::put($key, $attempts, now()->addHour());

        // Si plus de 10 tentatives échouées en 1 heure : alerte sécurité
        if ($attempts >= 10) {
            Log::channel('security')->alert('Activité suspecte détectée', [
                'ip'              => $ip,
                'email'           => $email,
                'failed_attempts' => $attempts,
                'timestamp'       => now()->toIso8601String(),
            ]);

            self::incrementMetric('suspicious_activity_detected');

            // Notifier tous les super_admins actifs par email
            try {
                $superAdmins = \App\Models\User::where('role', 'super_admin')
                    ->where('is_active', true)
                    ->pluck('email')
                    ->toArray();

                if (!empty($superAdmins)) {
                    \Illuminate\Support\Facades\Mail::raw(
                        sprintf(
                            "[KAMLOG — Alerte Sécurité]\n\nActivité suspecte détectée.\n\nIP : %s\nEmail ciblé : %s\nTentatives échouées : %d en 1 heure\n\nDate : %s\n\nVérifiez vos logs de sécurité immédiatement.",
                            $ip,
                            $email,
                            $attempts,
                            now()->format('d/m/Y H:i:s')
                        ),
                        function ($message) use ($superAdmins) {
                            $message->to($superAdmins)
                                    ->subject('[KAMLOG] ⚠️ Alerte Sécurité — Activité Suspecte Détectée');
                        }
                    );
                }
            } catch (\Throwable $e) {
                // Ne jamais laisser l'échec de notification crasher l'application
                Log::channel('security')->error('Impossible d\'envoyer la notification d\'alerte', [
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Incrémenter une métrique
     */
    protected static function incrementMetric(string $metric): void
    {
        $key = "auth_metrics:{$metric}:" . now()->format('Y-m-d');

        if (!Cache::has($key)) {
            Cache::put($key, 0, now()->addDays(30));
        }

        Cache::increment($key);
    }

    /**
     * Obtenir les métriques du jour
     */
    public static function getTodayMetrics(): array
    {
        $date = now()->format('Y-m-d');
        $metrics = [
            'login_success',
            'login_failed',
            'logout',
            'token_refresh',
            'access_denied',
            'rate_limit_hit',
            'suspicious_activity_detected',
        ];

        $result = [];
        foreach ($metrics as $metric) {
            $key = "auth_metrics:{$metric}:{$date}";
            $result[$metric] = Cache::get($key, 0);
        }

        return $result;
    }

    /**
     * Obtenir les métriques d'une période
     */
    public static function getMetricsForPeriod(int $days = 7): array
    {
        $result = [];
        
        for ($i = 0; $i < $days; $i++) {
            $date = now()->subDays($i)->format('Y-m-d');
            $result[$date] = [
                'login_success' => Cache::get("auth_metrics:login_success:{$date}", 0),
                'login_failed' => Cache::get("auth_metrics:login_failed:{$date}", 0),
                'logout' => Cache::get("auth_metrics:logout:{$date}", 0),
            ];
        }

        return $result;
    }
}

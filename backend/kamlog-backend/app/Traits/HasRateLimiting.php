<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

trait HasRateLimiting
{
    /**
     * Vérifier le rate limiting
     */
    protected function checkRateLimit(Request $request, string $action, int $maxAttempts, int $decayMinutes = 1): bool
    {
        $key = $this->getRateLimitKey($request, $action);
        
        return RateLimiter::tooManyAttempts($key, $maxAttempts);
    }

    /**
     * Obtenir le temps restant avant disponibilité
     */
    protected function getRateLimitAvailableIn(Request $request, string $action): int
    {
        $key = $this->getRateLimitKey($request, $action);
        
        return RateLimiter::availableIn($key);
    }

    /**
     * Incrémenter le compteur de rate limiting
     */
    protected function hitRateLimit(Request $request, string $action, int $decaySeconds = 60): void
    {
        $key = $this->getRateLimitKey($request, $action);
        
        RateLimiter::hit($key, $decaySeconds);
    }

    /**
     * Réinitialiser le rate limiting
     */
    protected function clearRateLimit(Request $request, string $action): void
    {
        $key = $this->getRateLimitKey($request, $action);
        
        RateLimiter::clear($key);
    }

    /**
     * Générer la clé de rate limiting
     */
    protected function getRateLimitKey(Request $request, string $action): string
    {
        return strtolower(class_basename($this)) . ':' . $action . ':' . $request->ip();
    }
}

<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait HasCache
{
    /**
     * Durée du cache par défaut (en secondes)
     */
    protected int $cacheDuration = 3600; // 1 heure

    /**
     * Préfixe pour les clés de cache
     */
    protected function getCachePrefix(): string
    {
        return strtolower(class_basename($this)) . ':';
    }

    /**
     * Générer une clé de cache
     */
    protected function cacheKey(string $key): string
    {
        return $this->getCachePrefix() . $key;
    }

    /**
     * Check if the cache driver supports tags (Redis, Memcached)
     */
    protected function cacheSupportsTag(): bool
    {
        try {
            return Cache::getStore() instanceof \Illuminate\Cache\TaggableStore;
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Get the cache tag name for this controller
     */
    protected function getCacheTag(): string
    {
        return strtolower(class_basename($this));
    }

    /**
     * Récupérer depuis le cache ou exécuter le callback
     */
    protected function remember(string $key, callable $callback, ?int $ttl = null)
    {
        $ttl = $ttl ?? $this->cacheDuration;
        $fullKey = $this->cacheKey($key);

        if ($this->cacheSupportsTag()) {
            return Cache::tags([$this->getCacheTag()])->remember($fullKey, $ttl, $callback);
        }

        $this->registerCacheKey($key);
        return Cache::remember($fullKey, $ttl, $callback);
    }

    /**
     * Invalider une clé de cache
     */
    protected function forgetCache(string $key): bool
    {
        if ($this->cacheSupportsTag()) {
            return Cache::tags([$this->getCacheTag()])->forget($this->cacheKey($key));
        }

        return Cache::forget($this->cacheKey($key));
    }

    /**
     * Invalider tous les caches de cette entité
     */
    protected function flushCache(): void
    {
        if ($this->cacheSupportsTag()) {
            Cache::tags([$this->getCacheTag()])->flush();
            return;
        }

        // Fallback: key registry for drivers without tag support (database, file)
        $prefix = $this->getCachePrefix();
        $keys = Cache::get($prefix . 'keys', []);
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
        
        Cache::forget($prefix . 'keys');
    }

    /**
     * Enregistrer une clé de cache (fallback for non-taggable drivers)
     */
    protected function registerCacheKey(string $key): void
    {
        $prefix = $this->getCachePrefix();
        $fullKey = $this->cacheKey($key);
        $keys = Cache::get($prefix . 'keys', []);
        
        if (!in_array($fullKey, $keys)) {
            $keys[] = $fullKey;
            Cache::put($prefix . 'keys', $keys, now()->addDays(30));
        }
    }
}

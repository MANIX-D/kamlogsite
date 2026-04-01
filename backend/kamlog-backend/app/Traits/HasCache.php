<?php

namespace App\Traits;

use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;

trait HasCache
{
    /**
     * Memoized: whether the cache driver supports tags.
     */
    private static ?bool $cacheTagSupport = null;

    /**
     * Memoized: cache prefix per concrete class (avoids repeated class_basename + strtolower).
     */
    private static array $cachePrefixes = [];

    /**
     * In-memory set of keys already registered in this request lifecycle.
     * Prevents redundant distributed lock acquisitions on the hot read path.
     */
    private static array $registeredKeys = [];

    /**
     * Registry TTL in seconds (30 days). Raw int avoids Carbon instantiation.
     */
    private const REGISTRY_TTL = 2_592_000;

    /**
     * Durée du cache par défaut (en secondes).
     * Override in the using class for a different default.
     */
    protected function getCacheDuration(): int
    {
        return 3600;
    }

    /**
     * Préfixe pour les clés de cache (memoized per class).
     */
    protected function getCachePrefix(): string
    {
        $class = static::class;

        return static::$cachePrefixes[$class]
            ??= strtolower(class_basename($this)) . ':';
    }

    /**
     * Générer une clé de cache complète.
     */
    protected function cacheKey(string $key): string
    {
        return $this->getCachePrefix() . $key;
    }

    /**
     * Check if the cache driver supports tags (Redis, Memcached).
     * Memoized — evaluated once per process.
     */
    protected function cacheSupportsTag(): bool
    {
        if (static::$cacheTagSupport !== null) {
            return static::$cacheTagSupport;
        }

        try {
            static::$cacheTagSupport = Cache::getStore() instanceof \Illuminate\Cache\TaggableStore;
        } catch (\Throwable) {
            static::$cacheTagSupport = false;
        }

        return static::$cacheTagSupport;
    }

    /**
     * Tag name for this controller (memoized via getCachePrefix).
     */
    protected function getCacheTag(): string
    {
        return rtrim($this->getCachePrefix(), ':');
    }

    /**
     * Récupérer depuis le cache ou exécuter le callback.
     */
    protected function remember(string $key, callable $callback, ?int $ttl = null): mixed
    {
        $ttl = $ttl ?? $this->getCacheDuration();
        $fullKey = $this->cacheKey($key);

        if ($this->cacheSupportsTag()) {
            return Cache::tags([$this->getCacheTag()])->remember($fullKey, $ttl, $callback);
        }

        $this->registerCacheKey($fullKey);
        return Cache::remember($fullKey, $ttl, $callback);
    }

    /**
     * Cache sans expiration — pour les données rarement modifiées.
     */
    protected function rememberForever(string $key, callable $callback): mixed
    {
        $fullKey = $this->cacheKey($key);

        if ($this->cacheSupportsTag()) {
            return Cache::tags([$this->getCacheTag()])->rememberForever($fullKey, $callback);
        }

        $this->registerCacheKey($fullKey);
        return Cache::rememberForever($fullKey, $callback);
    }

    /**
     * Invalider une clé de cache.
     */
    protected function forgetCache(string $key): bool
    {
        $fullKey = $this->cacheKey($key);

        if ($this->cacheSupportsTag()) {
            return Cache::tags([$this->getCacheTag()])->forget($fullKey);
        }

        $this->unregisterCacheKey($fullKey);
        return Cache::forget($fullKey);
    }

    /**
     * Invalider tous les caches de cette entité.
     */
    protected function flushCache(): void
    {
        if ($this->cacheSupportsTag()) {
            Cache::tags([$this->getCacheTag()])->flush();
            return;
        }

        $registryKey = $this->getRegistryKey();
        $acquired = false;
        $lock = Cache::lock($registryKey . ':lock', 10);

        try {
            $lock->block(5);
            $acquired = true;

            $registry = Cache::get($registryKey, []);

            foreach (array_keys($registry) as $cachedKey) {
                Cache::forget($cachedKey);
            }

            Cache::forget($registryKey);
        } catch (LockTimeoutException) {
            // Best-effort: flush without lock
            $registry = Cache::get($registryKey, []);
            foreach (array_keys($registry) as $cachedKey) {
                Cache::forget($cachedKey);
            }
            Cache::forget($registryKey);
        } finally {
            if ($acquired) {
                $lock->release();
            }
        }

        // Clear in-memory tracking for this prefix
        $prefix = $this->getCachePrefix();
        static::$registeredKeys = array_filter(
            static::$registeredKeys,
            fn (string $k) => !str_starts_with($k, $prefix),
            ARRAY_FILTER_USE_KEY,
        );
    }

    /**
     * Enregistrer une clé de cache dans le registre (fallback for non-taggable drivers).
     *
     * Optimisations:
     * - In-memory set skips the lock entirely if the key was already registered this request.
     * - Registry stored as associative array (key => true) for O(1) isset() lookups.
     * - Lock acquisition tracked to avoid releasing an unacquired lock.
     */
    protected function registerCacheKey(string $fullKey): void
    {
        // Fast path: already registered in this request — no I/O at all
        if (isset(static::$registeredKeys[$fullKey])) {
            return;
        }

        static::$registeredKeys[$fullKey] = true;

        $registryKey = $this->getRegistryKey();
        $acquired = false;
        $lock = Cache::lock($registryKey . ':lock', 5);

        try {
            $lock->block(3);
            $acquired = true;

            $registry = Cache::get($registryKey, []);

            if (!isset($registry[$fullKey])) {
                $registry[$fullKey] = true;
                Cache::put($registryKey, $registry, self::REGISTRY_TTL);
            }
        } catch (LockTimeoutException) {
            // Key is still cached; it just won't appear in the registry for flush.
        } finally {
            if ($acquired) {
                $lock->release();
            }
        }
    }

    /**
     * Retirer une clé du registre (fallback for non-taggable drivers).
     */
    protected function unregisterCacheKey(string $fullKey): void
    {
        unset(static::$registeredKeys[$fullKey]);

        $registryKey = $this->getRegistryKey();
        $acquired = false;
        $lock = Cache::lock($registryKey . ':lock', 5);

        try {
            $lock->block(3);
            $acquired = true;

            $registry = Cache::get($registryKey, []);

            if (isset($registry[$fullKey])) {
                unset($registry[$fullKey]);
                Cache::put($registryKey, $registry, self::REGISTRY_TTL);
            }
        } catch (LockTimeoutException) {
            // Best-effort removal
        } finally {
            if ($acquired) {
                $lock->release();
            }
        }
    }

    /**
     * Clé du registre pour ce préfixe.
     */
    private function getRegistryKey(): string
    {
        return $this->getCachePrefix() . '_registry';
    }
}

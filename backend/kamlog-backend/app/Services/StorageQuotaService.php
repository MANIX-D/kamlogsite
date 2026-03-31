<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StorageQuotaService
{
    /**
     * Quotas par défaut (en bytes)
     */
    protected array $defaultQuotas = [
        'images_per_folder' => 100 * 1024 * 1024,  // 100 MB par dossier
        'cvs_per_user' => 10 * 1024 * 1024,        // 10 MB par utilisateur
        'total_images' => 1024 * 1024 * 1024,      // 1 GB total images
        'total_cvs' => 500 * 1024 * 1024,          // 500 MB total CVs
        'max_files_per_folder' => 1000,            // 1000 fichiers max par dossier
    ];

    /**
     * Vérifier si un upload est autorisé
     */
    public function canUpload(string $disk, string $folder, int $fileSize): bool
    {
        // Vérifier le quota du dossier
        if (!$this->checkFolderQuota($disk, $folder, $fileSize)) {
            return false;
        }

        // Vérifier le quota global
        if (!$this->checkGlobalQuota($disk, $fileSize)) {
            return false;
        }

        // Vérifier le nombre de fichiers
        if (!$this->checkFileCountQuota($disk, $folder)) {
            return false;
        }

        return true;
    }

    /**
     * Vérifier le quota d'un dossier
     */
    protected function checkFolderQuota(string $disk, string $folder, int $fileSize): bool
    {
        $currentSize = $this->getFolderSize($disk, $folder);
        $quota = $this->getFolderQuota($disk);

        return ($currentSize + $fileSize) <= $quota;
    }

    /**
     * Vérifier le quota global
     */
    protected function checkGlobalQuota(string $disk, int $fileSize): bool
    {
        $currentSize = $this->getDiskSize($disk);
        $quota = $this->getGlobalQuota($disk);

        return ($currentSize + $fileSize) <= $quota;
    }

    /**
     * Vérifier le nombre de fichiers
     */
    protected function checkFileCountQuota(string $disk, string $folder): bool
    {
        $fileCount = $this->getFolderFileCount($disk, $folder);
        $maxFiles = $this->defaultQuotas['max_files_per_folder'];

        return $fileCount < $maxFiles;
    }

    /**
     * Obtenir la taille d'un dossier (avec cache)
     */
    public function getFolderSize(string $disk, string $folder): int
    {
        $cacheKey = "storage_quota:{$disk}:{$folder}:size";

        return Cache::remember($cacheKey, 300, function () use ($disk, $folder) {
            $files = Storage::disk($disk)->allFiles($folder);
            $totalSize = 0;

            foreach ($files as $file) {
                $totalSize += Storage::disk($disk)->size($file);
            }

            return $totalSize;
        });
    }

    /**
     * Obtenir la taille totale d'un disque (avec cache)
     */
    public function getDiskSize(string $disk): int
    {
        $cacheKey = "storage_quota:{$disk}:total_size";

        return Cache::remember($cacheKey, 600, function () use ($disk) {
            $files = Storage::disk($disk)->allFiles();
            $totalSize = 0;

            foreach ($files as $file) {
                $totalSize += Storage::disk($disk)->size($file);
            }

            return $totalSize;
        });
    }

    /**
     * Obtenir le nombre de fichiers dans un dossier
     */
    public function getFolderFileCount(string $disk, string $folder): int
    {
        $cacheKey = "storage_quota:{$disk}:{$folder}:count";

        return Cache::remember($cacheKey, 300, function () use ($disk, $folder) {
            return count(Storage::disk($disk)->allFiles($folder));
        });
    }

    /**
     * Invalider le cache après un upload
     */
    public function invalidateCache(string $disk, string $folder): void
    {
        Cache::forget("storage_quota:{$disk}:{$folder}:size");
        Cache::forget("storage_quota:{$disk}:{$folder}:count");
        Cache::forget("storage_quota:{$disk}:total_size");
    }

    /**
     * Obtenir le quota d'un dossier
     */
    protected function getFolderQuota(string $disk): int
    {
        return match($disk) {
            'images' => $this->defaultQuotas['images_per_folder'],
            'cvs' => $this->defaultQuotas['cvs_per_user'],
            default => 50 * 1024 * 1024, // 50 MB par défaut
        };
    }

    /**
     * Obtenir le quota global
     */
    protected function getGlobalQuota(string $disk): int
    {
        return match($disk) {
            'images' => $this->defaultQuotas['total_images'],
            'cvs' => $this->defaultQuotas['total_cvs'],
            default => 500 * 1024 * 1024,
        };
    }

    /**
     * Obtenir les statistiques de stockage
     */
    public function getStorageStats(string $disk): array
    {
        $totalSize = $this->getDiskSize($disk);
        $quota = $this->getGlobalQuota($disk);
        $usage = $totalSize > 0 ? ($totalSize / $quota) * 100 : 0;

        return [
            'disk' => $disk,
            'total_size' => $totalSize,
            'total_size_mb' => round($totalSize / 1024 / 1024, 2),
            'quota' => $quota,
            'quota_mb' => round($quota / 1024 / 1024, 2),
            'usage_percent' => round($usage, 2),
            'available' => $quota - $totalSize,
            'available_mb' => round(($quota - $totalSize) / 1024 / 1024, 2),
        ];
    }

    /**
     * Nettoyer les fichiers anciens (garbage collection)
     */
    public function cleanupOldFiles(string $disk, int $daysOld = 90): int
    {
        $files = Storage::disk($disk)->allFiles();
        $deletedCount = 0;
        $threshold = now()->subDays($daysOld)->timestamp;

        foreach ($files as $file) {
            $lastModified = Storage::disk($disk)->lastModified($file);

            if ($lastModified < $threshold) {
                Storage::disk($disk)->delete($file);
                $deletedCount++;
            }
        }

        // Invalider les caches connus (tags non supportés par le driver database)
        $folders = collect(Storage::disk($disk)->directories())->map(fn ($dir) => basename($dir));
        foreach ($folders as $folder) {
            $this->invalidateCache($disk, $folder);
        }

        return $deletedCount;
    }

    /**
     * Vérifier l'espace disque système
     */
    public function checkSystemDiskSpace(): array
    {
        $storagePath = storage_path();
        $totalSpace = disk_total_space($storagePath);
        $freeSpace = disk_free_space($storagePath);
        $usedSpace = $totalSpace - $freeSpace;
        $usagePercent = ($usedSpace / $totalSpace) * 100;

        return [
            'total_gb' => round($totalSpace / 1024 / 1024 / 1024, 2),
            'used_gb' => round($usedSpace / 1024 / 1024 / 1024, 2),
            'free_gb' => round($freeSpace / 1024 / 1024 / 1024, 2),
            'usage_percent' => round($usagePercent, 2),
            'critical' => $usagePercent > 90,
            'warning' => $usagePercent > 80,
        ];
    }
}

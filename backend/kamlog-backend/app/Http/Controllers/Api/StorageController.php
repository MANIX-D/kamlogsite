<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StorageQuotaService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StorageController extends Controller
{
    use ApiResponses;

    protected StorageQuotaService $quotaService;

    public function __construct(StorageQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    /**
     * Obtenir les statistiques de stockage (admin uniquement)
     */
    public function stats(Request $request): JsonResponse
    {
        $disk = $request->input('disk', 'images');

        if (!in_array($disk, ['images', 'cvs', 'documents'])) {
            return $this->errorResponse('Disque non valide', 422);
        }

        $stats = $this->quotaService->getStorageStats($disk);

        return $this->successResponse($stats);
    }

    /**
     * Obtenir les statistiques de tous les disques
     */
    public function allStats(): JsonResponse
    {
        $allStats = [];

        foreach (['images', 'cvs', 'documents'] as $disk) {
            $allStats[$disk] = $this->quotaService->getStorageStats($disk);
        }

        // Ajouter les stats système
        $allStats['system'] = $this->quotaService->checkSystemDiskSpace();

        return $this->successResponse($allStats);
    }

    /**
     * Obtenir la taille d'un dossier spécifique
     */
    public function folderSize(Request $request): JsonResponse
    {
        $request->validate([
            'disk' => 'required|in:images,cvs,documents',
            'folder' => 'required|string',
        ]);

        $disk = $request->input('disk');
        $folder = $request->input('folder');

        $size = $this->quotaService->getFolderSize($disk, $folder);
        $fileCount = $this->quotaService->getFolderFileCount($disk, $folder);

        return $this->successResponse([
            'disk' => $disk,
            'folder' => $folder,
            'size_bytes' => $size,
            'size_mb' => round($size / 1024 / 1024, 2),
            'file_count' => $fileCount,
        ]);
    }

    /**
     * Vérifier la santé du stockage
     */
    public function health(): JsonResponse
    {
        $health = [
            'status' => 'healthy',
            'issues' => [],
            'warnings' => [],
        ];

        // Vérifier le système
        $systemDisk = $this->quotaService->checkSystemDiskSpace();
        
        if ($systemDisk['critical']) {
            $health['status'] = 'critical';
            $health['issues'][] = 'Espace disque système critique (< 10%)';
        } elseif ($systemDisk['warning']) {
            $health['status'] = 'warning';
            $health['warnings'][] = 'Espace disque système faible (< 20%)';
        }

        // Vérifier les quotas
        foreach (['images', 'cvs', 'documents'] as $disk) {
            $stats = $this->quotaService->getStorageStats($disk);
            
            if ($stats['usage_percent'] > 90) {
                $health['status'] = 'critical';
                $health['issues'][] = "Quota {$disk} critique (> 90%)";
            } elseif ($stats['usage_percent'] > 80) {
                if ($health['status'] !== 'critical') {
                    $health['status'] = 'warning';
                }
                $health['warnings'][] = "Quota {$disk} élevé (> 80%)";
            }
        }

        $health['system_disk'] = $systemDisk;
        $health['timestamp'] = now()->toIso8601String();

        return $this->successResponse($health);
    }
}

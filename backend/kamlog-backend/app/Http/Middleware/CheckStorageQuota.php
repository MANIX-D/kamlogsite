<?php

namespace App\Http\Middleware;

use App\Services\StorageQuotaService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStorageQuota
{
    protected StorageQuotaService $quotaService;

    public function __construct(StorageQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    /**
     * Vérifier les quotas avant l'upload
     */
    public function handle(Request $request, Closure $next, string $disk = 'images'): Response
    {
        // Vérifier si c'est une requête d'upload
        if (!$request->hasFile('image') && !$request->hasFile('cv') && !$request->hasFile('document')) {
            return $next($request);
        }

        // Obtenir le fichier
        $file = $request->file('image') ?? $request->file('cv') ?? $request->file('document');
        
        if (!$file) {
            return $next($request);
        }

        // Obtenir le dossier
        $folder = $request->input('folder', 'general');
        
        // Vérifier les quotas
        if (!$this->quotaService->canUpload($disk, $folder, $file->getSize())) {
            return response()->json([
                'success' => false,
                'message' => 'Quota de stockage dépassé. Veuillez contacter l\'administrateur.',
                'error' => 'QUOTA_EXCEEDED'
            ], 507); // 507 Insufficient Storage
        }

        return $next($request);
    }
}

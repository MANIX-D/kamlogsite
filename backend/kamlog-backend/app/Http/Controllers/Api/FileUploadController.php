<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use App\Http\Requests\UploadCVRequest;
use App\Services\FileUploadServiceSecure;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    use ApiResponses;

    protected FileUploadServiceSecure $fileUploadService;

    public function __construct(FileUploadServiceSecure $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Upload une image (admin uniquement)
     */
    public function uploadImage(UploadImageRequest $request): JsonResponse
    {
        try {
            $options = [
                'max_width' => $request->input('max_width', 1920),
                'max_height' => $request->input('max_height', 1080),
                'quality' => $request->input('quality', 85),
                'thumbnail' => $request->boolean('thumbnail', true),
                'thumb_width' => $request->input('thumb_width', 300),
                'thumb_height' => $request->input('thumb_height', 300),
            ];

            $folder = $request->input('folder', 'general');

            $result = $this->fileUploadService->uploadImage(
                $request->file('image'),
                $folder,
                $options
            );

            return $this->successResponse($result, 'Image uploadée avec succès', 201);
        } catch (\InvalidArgumentException $e) {
            // Erreurs de validation - message peut être exposé
            return $this->errorResponse($e->getMessage(), 422);
        } catch (\Exception $e) {
            // Erreurs système - logger et message générique
            \Log::error('Échec upload image', [
                'user_id' => $request->user()?->id,
                'folder' => $request->input('folder'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->errorResponse(
                'Une erreur est survenue lors de l\'upload de l\'image',
                500
            );
        }
    }

    /**
     * Upload un CV (public)
     */
    public function uploadCV(UploadCVRequest $request): JsonResponse
    {
        try {
            $userId = $request->input('user_id');

            $result = $this->fileUploadService->uploadCV(
                $request->file('cv'),
                $userId
            );

            return $this->successResponse($result, 'CV uploadé avec succès', 201);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        } catch (\Exception $e) {
            \Log::error('Échec upload CV', [
                'user_id' => $request->input('user_id'),
                'ip' => $request->ip(),
                'error' => $e->getMessage()
            ]);
            
            return $this->errorResponse(
                'Une erreur est survenue lors de l\'upload du CV',
                500
            );
        }
    }

    /**
     * Supprimer une image (admin uniquement)
     */
    public function deleteImage(Request $request): JsonResponse
    {
        $request->validate([
            'path' => [
                'required',
                'string',
                'regex:/^[a-z_]+\/[a-z0-9_\-]+\.(jpg|jpeg|png|gif|webp)$/i'
            ],
        ]);

        try {
            $deleted = $this->fileUploadService->deleteImage($request->input('path'));

            if (!$deleted) {
                return $this->errorResponse('Image non trouvée ou déjà supprimée', 404);
            }

            \Log::info('Image supprimée', [
                'user_id' => $request->user()?->id,
                'path' => $request->input('path')
            ]);

            return $this->successResponse(null, 'Image supprimée avec succès');
        } catch (\Exception $e) {
            \Log::error('Échec suppression image', [
                'user_id' => $request->user()?->id,
                'path' => $request->input('path'),
                'error' => $e->getMessage()
            ]);
            
            return $this->errorResponse(
                'Une erreur est survenue lors de la suppression',
                500
            );
        }
    }

    /**
     * Télécharger un CV (admin uniquement)
     */
    public function downloadCV(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse|JsonResponse
    {
        $request->validate([
            'path' => [
                'required',
                'string',
                'max:500',
                'regex:/^[a-z0-9_]+\/[a-z0-9_\-]+\.(pdf|doc|docx)$/i'
            ],
        ]);

        try {
            $path = $request->input('path');

            if (!Storage::disk('public')->exists($path)) {
                return $this->errorResponse('CV non trouvé', 404);
            }

            return Storage::disk('public')->download($path);
        } catch (\Exception $e) {
            \Log::error('Échec téléchargement CV', [
                'user_id' => $request->user()?->id,
                'path' => $request->input('path'),
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse(
                'Une erreur est survenue lors du téléchargement du CV',
                500
            );
        }
    }

    /**
     * Supprimer un CV (admin uniquement)
     */
    public function deleteCV(Request $request): JsonResponse
    {
        $request->validate([
            'path' => [
                'required',
                'string',
                'max:500',
                'regex:/^[a-z0-9_]+\/[a-z0-9_\-]+\.(pdf|doc|docx)$/i'
            ],
        ]);

        try {
            $path = $request->input('path');
            $deleted = Storage::disk('public')->exists($path)
                ? Storage::disk('public')->delete($path)
                : false;

            if (!$deleted) {
                return $this->errorResponse('CV non trouvé ou déjà supprimé', 404);
            }

            return $this->successResponse(null, 'CV supprimé avec succès');
        } catch (\Exception $e) {
            \Log::error('Échec suppression CV', [
                'user_id' => $request->user()?->id,
                'path' => $request->input('path'),
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse(
                'Une erreur est survenue lors de la suppression du CV',
                500
            );
        }
    }

    /**
     * Obtenir les informations d'une image
     */
    public function getImageInfo(Request $request): JsonResponse
    {
        $request->validate([
            'path' => [
                'required',
                'string',
                'regex:/^[a-z_]+\/[a-z0-9_\-]+\.(jpg|jpeg|png|gif|webp)$/i'
            ],
        ]);

        try {
            $path = $request->input('path');

            if (!$this->fileUploadService->exists($path, 'images')) {
                return $this->errorResponse('Image non trouvée', 404);
            }

            $info = [
                'path' => $path,
                'url' => $this->fileUploadService->getImageUrl($path),
                'size' => $this->fileUploadService->getFileSize($path, 'images'),
                'exists' => true,
            ];

            return $this->successResponse($info);
        } catch (\Exception $e) {
            \Log::error('Échec récupération info image', [
                'error' => $e->getMessage()
            ]);
            
            return $this->errorResponse(
                'Une erreur est survenue',
                500
            );
        }
    }
}

<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class FileUploadService
{
    /**
     * Upload une image publique
     */
    public function uploadImage(UploadedFile $file, string $folder = 'general', array $options = []): array
    {
        // Générer un nom unique
        $filename = $this->generateUniqueFilename($file);
        
        // Chemin de stockage
        $path = $folder . '/' . $filename;
        
        // Options par défaut
        $maxWidth = $options['max_width'] ?? 1920;
        $maxHeight = $options['max_height'] ?? 1080;
        $quality = $options['quality'] ?? 85;
        $createThumbnail = $options['thumbnail'] ?? true;
        
        // Optimiser et stocker l'image
        $image = Image::make($file);
        
        // Redimensionner si nécessaire
        if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
            $image->resize($maxWidth, $maxHeight, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }
        
        // Encoder et stocker
        $encodedImage = $image->encode($file->getClientOriginalExtension(), $quality);
        Storage::disk('images')->put($path, $encodedImage);
        
        // Créer une miniature si demandé
        $thumbnailPath = null;
        if ($createThumbnail) {
            $thumbnailPath = $this->createThumbnail($file, $folder, $filename, $options);
        }
        
        return [
            'path' => $path,
            'url' => Storage::disk('images')->url($path),
            'thumbnail_path' => $thumbnailPath,
            'thumbnail_url' => $thumbnailPath ? Storage::disk('images')->url($thumbnailPath) : null,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => Storage::disk('images')->size($path),
        ];
    }

    /**
     * Upload un CV (privé)
     */
    public function uploadCV(UploadedFile $file, ?int $userId = null): array
    {
        // Générer un nom unique
        $filename = $this->generateUniqueFilename($file);
        
        // Organiser par utilisateur si fourni
        $folder = $userId ? "user_{$userId}" : 'general';
        $path = $folder . '/' . $filename;
        
        // Stocker le fichier
        Storage::disk('cvs')->put($path, file_get_contents($file));
        
        return [
            'path' => $path,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => Storage::disk('cvs')->size($path),
            'disk' => 'cvs',
        ];
    }

    /**
     * Upload un document privé
     */
    public function uploadDocument(UploadedFile $file, string $folder = 'general'): array
    {
        // Générer un nom unique
        $filename = $this->generateUniqueFilename($file);
        
        // Chemin de stockage
        $path = $folder . '/' . $filename;
        
        // Stocker le fichier
        Storage::disk('documents')->put($path, file_get_contents($file));
        
        return [
            'path' => $path,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => Storage::disk('documents')->size($path),
            'disk' => 'documents',
        ];
    }

    /**
     * Créer une miniature
     */
    protected function createThumbnail(UploadedFile $file, string $folder, string $filename, array $options = []): string
    {
        $thumbWidth = $options['thumb_width'] ?? 300;
        $thumbHeight = $options['thumb_height'] ?? 300;
        
        // Nom du fichier miniature
        $thumbFilename = 'thumb_' . $filename;
        $thumbPath = $folder . '/' . $thumbFilename;
        
        // Créer la miniature
        $thumbnail = Image::make($file);
        $thumbnail->fit($thumbWidth, $thumbHeight);
        
        // Encoder et stocker
        $encodedThumb = $thumbnail->encode($file->getClientOriginalExtension(), 80);
        Storage::disk('images')->put($thumbPath, $encodedThumb);
        
        return $thumbPath;
    }

    /**
     * Supprimer une image
     */
    public function deleteImage(string $path): bool
    {
        // Supprimer l'image principale
        $deleted = Storage::disk('images')->delete($path);
        
        // Supprimer la miniature si elle existe
        $thumbnailPath = $this->getThumbnailPath($path);
        if (Storage::disk('images')->exists($thumbnailPath)) {
            Storage::disk('images')->delete($thumbnailPath);
        }
        
        return $deleted;
    }

    /**
     * Supprimer un CV
     */
    public function deleteCV(string $path): bool
    {
        return Storage::disk('cvs')->delete($path);
    }

    /**
     * Supprimer un document
     */
    public function deleteDocument(string $path): bool
    {
        return Storage::disk('documents')->delete($path);
    }

    /**
     * Télécharger un fichier privé
     */
    public function downloadPrivateFile(string $path, string $disk = 'cvs'): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return Storage::disk($disk)->download($path);
    }

    /**
     * Générer un nom de fichier unique
     */
    protected function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $basename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        
        // Nettoyer le nom de base
        $basename = Str::slug($basename);
        
        // Ajouter un timestamp et un hash unique
        return $basename . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    /**
     * Obtenir le chemin de la miniature
     */
    protected function getThumbnailPath(string $path): string
    {
        $dirname = dirname($path);
        $filename = basename($path);
        
        return $dirname . '/thumb_' . $filename;
    }

    /**
     * Vérifier si un fichier existe
     */
    public function exists(string $path, string $disk = 'images'): bool
    {
        return Storage::disk($disk)->exists($path);
    }

    /**
     * Obtenir l'URL d'une image
     */
    public function getImageUrl(string $path): ?string
    {
        if (!$this->exists($path, 'images')) {
            return null;
        }
        
        return Storage::disk('images')->url($path);
    }

    /**
     * Obtenir la taille d'un fichier
     */
    public function getFileSize(string $path, string $disk = 'images'): ?int
    {
        if (!$this->exists($path, $disk)) {
            return null;
        }
        
        return Storage::disk($disk)->size($path);
    }
}

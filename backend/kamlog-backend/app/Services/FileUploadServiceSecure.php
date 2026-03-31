<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FileUploadServiceSecure
{
    protected StorageQuotaService $quotaService;

    public function __construct(StorageQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    /**
     * Dossiers autorisés pour les images
     */
    protected array $allowedImageFolders = [
        'services', 'news', 'partners', 'infrastructures', 
        'jobs', 'announcements', 'general'
    ];

    /**
     * Upload une image publique (sans Intervention/Image)
     */
    public function uploadImage(UploadedFile $file, string $folder = 'general', array $options = []): array
    {
        // Valider le dossier
        if (!in_array($folder, $this->allowedImageFolders)) {
            throw new \InvalidArgumentException('Dossier non autorisé');
        }

        // Vérifier le MIME type réel
        $this->validateImageMimeType($file);

        // Générer un nom unique sécurisé
        $filename = $this->generateSecureFilename($file);
        $path = $folder . '/' . $filename;

        // Options par défaut
        $maxWidth = min($options['max_width'] ?? 1920, 4000);
        $maxHeight = min($options['max_height'] ?? 1080, 4000);
        $quality = min(max($options['quality'] ?? 85, 1), 100);
        $createThumbnail = $options['thumbnail'] ?? true;

        try {
            // Vérifier les quotas
            if (!$this->quotaService->canUpload('images', $folder, $file->getSize())) {
                throw new \RuntimeException('Quota de stockage dépassé');
            }

            // Valider et optimiser l'image
            $imageData = $this->processImage($file, $maxWidth, $maxHeight, $quality);
            
            // Stocker l'image principale
            Storage::disk('images')->put($path, $imageData);
            
            // Invalider le cache des quotas
            $this->quotaService->invalidateCache('images', $folder);

            // Créer une miniature si demandé
            $thumbnailPath = null;
            $thumbnailUrl = null;
            
            if ($createThumbnail) {
                try {
                    $thumbWidth = min($options['thumb_width'] ?? 300, 1000);
                    $thumbHeight = min($options['thumb_height'] ?? 300, 1000);
                    
                    $thumbnailPath = $this->createThumbnail(
                        $file, 
                        $folder, 
                        $filename, 
                        $thumbWidth, 
                        $thumbHeight
                    );
                    $thumbnailUrl = Storage::disk('images')->url($thumbnailPath);
                } catch (\Exception $e) {
                    // Si la miniature échoue, on continue quand même
                    Log::warning('Échec création miniature', [
                        'path' => $path,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            return [
                'path' => $path,
                'url' => Storage::disk('images')->url($path),
                'thumbnail_path' => $thumbnailPath,
                'thumbnail_url' => $thumbnailUrl,
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => Storage::disk('images')->size($path),
            ];

        } catch (\Exception $e) {
            // Cleanup en cas d'erreur
            if (Storage::disk('images')->exists($path)) {
                Storage::disk('images')->delete($path);
            }
            
            Log::error('Échec upload image', [
                'folder' => $folder,
                'error' => $e->getMessage()
            ]);
            
            throw new \RuntimeException('Impossible d\'uploader l\'image');
        }
    }

    /**
     * Upload un CV (privé) - Version sécurisée
     */
    public function uploadCV(UploadedFile $file, ?int $userId = null): array
    {
        // Vérifier le MIME type réel
        $this->validateDocumentMimeType($file);

        // Générer un nom unique sécurisé
        $filename = $this->generateSecureFilename($file);

        // Organiser par utilisateur si fourni
        $folder = $userId ? "user_{$userId}" : 'general';
        $path = $folder . '/' . $filename;

        try {
            // Vérifier les quotas
            if (!$this->quotaService->canUpload('cvs', $folder, $file->getSize())) {
                throw new \RuntimeException('Quota de stockage dépassé');
            }

            // Utiliser putFileAs au lieu de file_get_contents
            Storage::disk('cvs')->putFileAs($folder, $file, $filename);
            
            // Invalider le cache des quotas
            $this->quotaService->invalidateCache('cvs', $folder);

            return [
                'path' => $path,
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => Storage::disk('cvs')->size($path),
                'disk' => 'cvs',
            ];

        } catch (\Exception $e) {
            // Cleanup en cas d'erreur
            if (Storage::disk('cvs')->exists($path)) {
                Storage::disk('cvs')->delete($path);
            }

            Log::error('Échec upload CV', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);

            throw new \RuntimeException('Impossible d\'uploader le CV');
        }
    }

    /**
     * Upload un document privé - Version sécurisée
     */
    public function uploadDocument(UploadedFile $file, string $folder = 'general'): array
    {
        // Valider le dossier (pas de path traversal)
        $folder = $this->sanitizePath($folder);

        // Vérifier le MIME type
        $this->validateDocumentMimeType($file);

        // Générer un nom unique sécurisé
        $filename = $this->generateSecureFilename($file);
        $path = $folder . '/' . $filename;

        try {
            Storage::disk('documents')->putFileAs($folder, $file, $filename);

            return [
                'path' => $path,
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => Storage::disk('documents')->size($path),
                'disk' => 'documents',
            ];

        } catch (\Exception $e) {
            if (Storage::disk('documents')->exists($path)) {
                Storage::disk('documents')->delete($path);
            }

            Log::error('Échec upload document', [
                'folder' => $folder,
                'error' => $e->getMessage()
            ]);

            throw new \RuntimeException('Impossible d\'uploader le document');
        }
    }

    /**
     * Supprimer une image - Version sécurisée
     */
    public function deleteImage(string $path): bool
    {
        // Valider le path (protection path traversal)
        $path = $this->sanitizePath($path);
        
        // Vérifier que le path est dans un dossier autorisé
        $folder = explode('/', $path)[0] ?? '';
        if (!in_array($folder, $this->allowedImageFolders)) {
            Log::warning('Tentative suppression dossier non autorisé', ['path' => $path]);
            return false;
        }

        if (!Storage::disk('images')->exists($path)) {
            return false;
        }

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
     * Supprimer un CV - Version sécurisée
     */
    public function deleteCV(string $path): bool
    {
        $path = $this->sanitizePath($path);

        if (!Storage::disk('cvs')->exists($path)) {
            return false;
        }

        return Storage::disk('cvs')->delete($path);
    }

    /**
     * Supprimer un document - Version sécurisée
     */
    public function deleteDocument(string $path): bool
    {
        $path = $this->sanitizePath($path);

        if (!Storage::disk('documents')->exists($path)) {
            return false;
        }

        return Storage::disk('documents')->delete($path);
    }

    /**
     * Télécharger un fichier privé - Version sécurisée
     */
    public function downloadPrivateFile(string $path, string $disk = 'cvs'): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $path = $this->sanitizePath($path);

        if (!in_array($disk, ['cvs', 'documents'])) {
            throw new \InvalidArgumentException('Disk non autorisé');
        }

        if (!Storage::disk($disk)->exists($path)) {
            throw new \RuntimeException('Fichier non trouvé');
        }

        return Storage::disk($disk)->download($path);
    }

    /**
     * Traiter une image avec GD (sans Intervention/Image)
     */
    protected function processImage(UploadedFile $file, int $maxWidth, int $maxHeight, int $quality): string
    {
        // Créer l'image depuis le fichier
        $imageInfo = getimagesize($file->getRealPath());
        
        if ($imageInfo === false) {
            throw new \RuntimeException('Fichier image invalide');
        }

        [$width, $height, $type] = $imageInfo;

        // Vérifier les dimensions (protection DoS)
        if ($width > 10000 || $height > 10000) {
            throw new \RuntimeException('Image trop grande');
        }

        // Créer la ressource image selon le type
        $source = match($type) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($file->getRealPath()),
            IMAGETYPE_PNG => imagecreatefrompng($file->getRealPath()),
            IMAGETYPE_GIF => imagecreatefromgif($file->getRealPath()),
            IMAGETYPE_WEBP => imagecreatefromwebp($file->getRealPath()),
            default => throw new \RuntimeException('Type d\'image non supporté'),
        };

        if ($source === false) {
            throw new \RuntimeException('Impossible de lire l\'image');
        }

        // Calculer les nouvelles dimensions
        if ($width > $maxWidth || $height > $maxHeight) {
            $ratio = min($maxWidth / $width, $maxHeight / $height);
            $newWidth = (int)($width * $ratio);
            $newHeight = (int)($height * $ratio);
        } else {
            $newWidth = $width;
            $newHeight = $height;
        }

        // Créer l'image redimensionnée
        $destination = imagecreatetruecolor($newWidth, $newHeight);

        // Préserver la transparence pour PNG et GIF
        if ($type === IMAGETYPE_PNG || $type === IMAGETYPE_GIF) {
            imagealphablending($destination, false);
            imagesavealpha($destination, true);
            $transparent = imagecolorallocatealpha($destination, 255, 255, 255, 127);
            imagefilledrectangle($destination, 0, 0, $newWidth, $newHeight, $transparent);
        }

        // Redimensionner
        imagecopyresampled($destination, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Encoder l'image
        ob_start();
        match($type) {
            IMAGETYPE_JPEG => imagejpeg($destination, null, $quality),
            IMAGETYPE_PNG => imagepng($destination, null, (int)(9 - ($quality / 11))),
            IMAGETYPE_GIF => imagegif($destination),
            IMAGETYPE_WEBP => imagewebp($destination, null, $quality),
        };
        $imageData = ob_get_clean();

        // Libérer la mémoire
        imagedestroy($source);
        imagedestroy($destination);

        return $imageData;
    }

    /**
     * Créer une miniature avec GD
     */
    protected function createThumbnail(UploadedFile $file, string $folder, string $filename, int $width, int $height): string
    {
        $thumbFilename = 'thumb_' . $filename;
        $thumbPath = $folder . '/' . $thumbFilename;

        $imageInfo = getimagesize($file->getRealPath());
        if ($imageInfo === false) {
            throw new \RuntimeException('Fichier image invalide');
        }

        [$origWidth, $origHeight, $type] = $imageInfo;

        $source = match($type) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($file->getRealPath()),
            IMAGETYPE_PNG => imagecreatefrompng($file->getRealPath()),
            IMAGETYPE_GIF => imagecreatefromgif($file->getRealPath()),
            IMAGETYPE_WEBP => imagecreatefromwebp($file->getRealPath()),
            default => throw new \RuntimeException('Type non supporté'),
        };

        // Créer la miniature (crop centré)
        $destination = imagecreatetruecolor($width, $height);

        // Calculer le crop
        $ratio = max($width / $origWidth, $height / $origHeight);
        $newWidth = (int)($origWidth * $ratio);
        $newHeight = (int)($origHeight * $ratio);
        $x = (int)(($width - $newWidth) / 2);
        $y = (int)(($height - $newHeight) / 2);

        imagecopyresampled($destination, $source, $x, $y, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

        // Encoder
        ob_start();
        match($type) {
            IMAGETYPE_JPEG => imagejpeg($destination, null, 80),
            IMAGETYPE_PNG => imagepng($destination, null, 7),
            IMAGETYPE_GIF => imagegif($destination),
            IMAGETYPE_WEBP => imagewebp($destination, null, 80),
        };
        $thumbData = ob_get_clean();

        imagedestroy($source);
        imagedestroy($destination);

        Storage::disk('images')->put($thumbPath, $thumbData);

        return $thumbPath;
    }

    /**
     * Générer un nom de fichier sécurisé avec UUID
     */
    protected function generateSecureFilename(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        
        // Utiliser UUID pour éviter les collisions et la prévisibilité
        $uuid = Str::uuid()->toString();
        
        return $uuid . '.' . $extension;
    }

    /**
     * Valider le MIME type réel d'une image
     */
    protected function validateImageMimeType(UploadedFile $file): void
    {
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        // Vérifier le MIME type déclaré
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \InvalidArgumentException('Type MIME non autorisé');
        }

        // Vérifier le MIME type réel via finfo
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $realMimeType = finfo_file($finfo, $file->getRealPath());
        finfo_close($finfo);

        if (!in_array($realMimeType, $allowedMimes)) {
            throw new \InvalidArgumentException('Type de fichier réel non autorisé');
        }
    }

    /**
     * Valider le MIME type réel d'un document
     */
    protected function validateDocumentMimeType(UploadedFile $file): void
    {
        $allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \InvalidArgumentException('Type MIME non autorisé');
        }

        // Vérifier le MIME type réel
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $realMimeType = finfo_file($finfo, $file->getRealPath());
        finfo_close($finfo);

        if (!in_array($realMimeType, $allowedMimes)) {
            throw new \InvalidArgumentException('Type de fichier réel non autorisé');
        }
    }

    /**
     * Nettoyer un path (protection path traversal)
     */
    protected function sanitizePath(string $path): string
    {
        // Supprimer les caractères dangereux
        $path = str_replace(['..', '\\', "\0"], '', $path);
        
        // Normaliser les slashes
        $path = str_replace('//', '/', $path);
        
        // Supprimer les slashes au début et à la fin
        $path = trim($path, '/');
        
        return $path;
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
        $path = $this->sanitizePath($path);
        return Storage::disk($disk)->exists($path);
    }

    /**
     * Obtenir l'URL d'une image
     */
    public function getImageUrl(string $path): ?string
    {
        $path = $this->sanitizePath($path);
        
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
        $path = $this->sanitizePath($path);
        
        if (!$this->exists($path, $disk)) {
            return null;
        }

        return Storage::disk($disk)->size($path);
    }
}

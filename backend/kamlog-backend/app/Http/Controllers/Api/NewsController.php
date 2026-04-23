<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use App\Traits\ApiResponses;
use App\Traits\HasCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NewsController extends Controller
{
    use ApiResponses, HasCache;
    /**
     * Liste toutes les actualités (public)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 12);
        $perPage = min(max($perPage, 1), 100);

        $isAdmin = $request->user() && ($request->user()->tokenCan('admin:*') || $request->user()->tokenCan('admin:read'));
        $type = $request->input('type');
        $isFeatured = $request->input('is_featured');
        $isPublished = $request->input('is_published');

        // Générer une clé de cache unique
        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $type . ':' . $isFeatured . ':' . $isPublished;

        $news = $this->remember($cacheKey, function () use ($request, $perPage, $isAdmin) {
            $query = News::query();

            // Filtrer par statut publié pour le public
            if (!$isAdmin) {
                $query->published();
            }

            // Filtres optionnels
            if ($request->has('type')) {
                $query->ofType($request->input('type'));
            }

            if ($request->has('is_featured')) {
                $query->featured();
            }

            if ($request->has('is_published')) {
                $query->where('is_published', $request->boolean('is_published'));
            }

            // Tri
            $query->latestPublished();

            return $query->paginate($perPage);
        }, 900); // Cache 15 minutes

        return $this->paginatedResponse($news);
    }

    /**
     * Affiche une actualité spécifique
     */
    public function show(string $id, Request $request): JsonResponse
    {
        $news = $this->remember('show:' . $id, function () use ($id) {
            return News::find($id);
        }, 1800); // Cache 30 minutes

        if (!$news) {
            return $this->notFoundResponse('Actualité non trouvée');
        }

        // Vérifier si l'actualité est publiée pour le public
        if ((!$request->user() || !($request->user()->tokenCan('admin:*') || $request->user()->tokenCan('admin:read'))) && !$news->is_published) {
            return $this->notFoundResponse('Actualité non trouvée');
        }

        // Incrémenter les vues (ne pas cacher cette partie)
        $news->incrementViews();

        return $this->successResponse($news);
    }

    /**
     * Affiche une actualité par slug
     */
    public function showBySlug(string $slug, Request $request): JsonResponse
    {
        $lang = $request->input('lang', 'fr');
        
        // Valider la langue
        if (!in_array($lang, ['fr', 'en'], true)) {
            $lang = 'fr';
        }
        
        $slugColumn = $lang === 'en' ? 'slug_en' : 'slug_fr';
        $isAdmin = $request->user() && ($request->user()->tokenCan('admin:*') || $request->user()->tokenCan('admin:read'));

        $cacheKey = 'slug:' . $slug . ':' . $lang . ':' . ($isAdmin ? 'admin' : 'public');

        $news = $this->remember($cacheKey, function () use ($slugColumn, $slug, $isAdmin) {
            $query = News::where($slugColumn, $slug);
            
            // Filtrer par statut publié pour le public
            if (!$isAdmin) {
                $query->where('is_published', true);
            }
            
            return $query->first();
        }, 1800); // Cache 30 minutes

        if (!$news) {
            return $this->notFoundResponse('Actualité non trouvée');
        }

        // Incrémenter les vues (ne pas cacher cette partie)
        $news->incrementViews();

        return $this->successResponse($news);
    }

    /**
     * Crée une nouvelle actualité (Admin)
     */
    public function store(NewsRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $data['image'] = $file->store('news', 'public');
            \Log::info('Image uploaded', ['path' => $data['image'], 'original' => $file->getClientOriginalName()]);
        } else {
            \Log::warning('No image file in request', ['has_image_key' => $request->has('image'), 'all_keys' => array_keys($request->all())]);
        }

        $news = News::create($data);

        // Invalider le cache
        $this->flushCache();
        Cache::forget('dashboard:stats');

        return $this->createdResponse($news, 'Actualité créée avec succès');
    }

    /**
     * Met à jour une actualité (Admin)
     */
    public function update(NewsRequest $request, string $id): JsonResponse
    {
        $news = News::find($id);

        if (!$news) {
            return $this->notFoundResponse('Actualité non trouvée');
        }

        \Log::info('Update request data:', $request->all());
        
        try {
            $data = $request->validated();
            \Log::info('Validated data:', $data);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', ['errors' => $e->errors()]);
            throw $e;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        $news->update($data);

        // Invalider le cache
        $this->flushCache();
        Cache::forget('dashboard:stats');

        return $this->successResponse($news->fresh(), 'Actualité mise à jour avec succès');
    }

    /**
     * Supprime une actualité (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $news = News::find($id);

        if (!$news) {
            return $this->notFoundResponse('Actualité non trouvée');
        }

        $news->delete();

        // Invalider le cache
        $this->flushCache();
        Cache::forget('dashboard:stats');

        return $this->successResponse(null, 'Actualité supprimée avec succès');
    }

    /**
     * Restaure une actualité supprimée (Admin)
     */
    public function restore(string $id): JsonResponse
    {
        $news = News::withTrashed()->find($id);

        if (!$news) {
            return $this->notFoundResponse('Actualité non trouvée');
        }

        if (!$news->trashed()) {
            return $this->errorResponse('L\'actualité n\'est pas supprimée', 400);
        }

        $news->restore();

        // Invalider le cache
        $this->flushCache();
        Cache::forget('dashboard:stats');

        return $this->successResponse($news, 'Actualité restaurée avec succès');
    }
}

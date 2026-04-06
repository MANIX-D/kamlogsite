<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementRequest;
use App\Models\Announcement;
use App\Traits\ApiResponses;
use App\Traits\HasCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    use ApiResponses, HasCache;
    /**
     * Liste toutes les annonces (public)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->input('per_page', 10), 1), 100);
        $isAdmin = $request->user() && ($request->user()->tokenCan('admin:*') || $request->user()->tokenCan('admin:read'));
        $type = $request->input('type');
        $priority = $request->input('priority');
        $isPopup = $request->has('is_popup');
        $isActive = $request->input('is_active');

        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $type . ':' . $priority . ':' . ($isPopup ? '1' : '0') . ':' . $isActive;

        $announcements = $this->remember($cacheKey, function () use ($perPage, $isAdmin, $type, $priority, $isPopup, $isActive) {
            $query = Announcement::query();

            if (!$isAdmin) {
                $query->active()->current();
            }

            if ($type) {
                $query->ofType($type);
            }

            if ($priority) {
                $query->ofPriority($priority);
            }

            if ($isPopup) {
                $query->popup();
            }

            if ($isActive !== null) {
                $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
            }

            $query->orderedByPriority()->latest();

            return $query->paginate($perPage);
        }, 1800);

        return $this->paginatedResponse($announcements);
    }

    /**
     * Affiche une annonce spécifique
     */
    public function show(string $id): JsonResponse
    {
        $announcement = $this->remember('show:' . $id, function () use ($id) {
            return Announcement::find($id);
        }, 1800);

        if (!$announcement) {
            return $this->notFoundResponse('Annonce non trouvée');
        }

        return $this->successResponse($announcement);
    }

    /**
     * Crée une nouvelle annonce (Admin)
     */
    public function store(AnnouncementRequest $request): JsonResponse
    {
        $announcement = Announcement::create($request->validated());

        $this->flushCache();

        return $this->createdResponse($announcement, 'Annonce créée avec succès');
    }

    /**
     * Met à jour une annonce (Admin)
     */
    public function update(AnnouncementRequest $request, string $id): JsonResponse
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFoundResponse('Annonce non trouvée');
        }

        $announcement->update($request->validated());

        $this->flushCache();

        return $this->successResponse($announcement->fresh(), 'Annonce mise à jour avec succès');
    }

    /**
     * Supprime une annonce (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFoundResponse('Annonce non trouvée');
        }

        $announcement->delete();

        $this->flushCache();

        return $this->successResponse(null, 'Annonce supprimée avec succès');
    }

    /**
     * Restaure une annonce supprimée (Admin)
     */
    public function restore(string $id): JsonResponse
    {
        $announcement = Announcement::withTrashed()->find($id);

        if (!$announcement) {
            return $this->notFoundResponse('Annonce non trouvée');
        }

        if (!$announcement->trashed()) {
            return $this->errorResponse('L\'annonce n\'est pas supprimée', 400);
        }

        $announcement->restore();

        $this->flushCache();

        return $this->successResponse($announcement, 'Annonce restaurée avec succès');
    }
}

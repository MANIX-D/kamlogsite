<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InfrastructureRequest;
use App\Models\Infrastructure;
use App\Traits\ApiResponses;
use App\Traits\HasCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InfrastructureController extends Controller
{
    use ApiResponses, HasCache;
    /**
     * Liste toutes les infrastructures (public)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $isAdmin = $request->user() && $request->user()->tokenCan('admin:*');
        $type = $request->input('type');
        $isAvailable = $request->has('is_available');
        $isActive = $request->input('is_active');

        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $type . ':' . ($isAvailable ? '1' : '0') . ':' . $isActive;

        $infrastructures = $this->remember($cacheKey, function () use ($perPage, $isAdmin, $type, $isAvailable, $isActive) {
            $query = Infrastructure::query();

            if (!$isAdmin) {
                $query->active();
            }

            if ($type) {
                $query->ofType($type);
            }

            if ($isAvailable) {
                $query->available();
            }

            if ($isActive !== null) {
                $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
            }

            $query->ordered();

            return $query->paginate($perPage);
        }, 3600);

        return $this->paginatedResponse($infrastructures);
    }

    /**
     * Affiche une infrastructure spécifique
     */
    public function show(string $id): JsonResponse
    {
        $infrastructure = $this->remember('show:' . $id, function () use ($id) {
            return Infrastructure::find($id);
        }, 3600);

        if (!$infrastructure) {
            return $this->notFoundResponse('Infrastructure non trouvée');
        }

        return $this->successResponse($infrastructure);
    }

    /**
     * Crée une nouvelle infrastructure (Admin)
     */
    public function store(InfrastructureRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('infrastructures', 'public');
        }

        // Default type if not provided
        if (empty($data['type'])) {
            $data['type'] = 'autre';
        }

        $infrastructure = Infrastructure::create($data);

        $this->flushCache();

        return $this->createdResponse($infrastructure, 'Infrastructure créée avec succès');
    }

    /**
     * Met à jour une infrastructure (Admin)
     */
    public function update(InfrastructureRequest $request, string $id): JsonResponse
    {
        $infrastructure = Infrastructure::find($id);

        if (!$infrastructure) {
            return $this->notFoundResponse('Infrastructure non trouvée');
        }

        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('infrastructures', 'public');
        }

        $infrastructure->update($data);

        $this->flushCache();

        return $this->successResponse($infrastructure->fresh(), 'Infrastructure mise à jour avec succès');
    }

    /**
     * Supprime une infrastructure (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $infrastructure = Infrastructure::find($id);

        if (!$infrastructure) {
            return $this->notFoundResponse('Infrastructure non trouvée');
        }

        $infrastructure->delete();

        $this->flushCache();

        return $this->successResponse(null, 'Infrastructure supprimée avec succès');
    }

    /**
     * Restaure une infrastructure supprimée (Admin)
     */
    public function restore(string $id): JsonResponse
    {
        $infrastructure = Infrastructure::withTrashed()->find($id);

        if (!$infrastructure) {
            return $this->notFoundResponse('Infrastructure non trouvée');
        }

        if (!$infrastructure->trashed()) {
            return $this->errorResponse('L\'infrastructure n\'est pas supprimée', 400);
        }

        $infrastructure->restore();

        $this->flushCache();

        return $this->successResponse($infrastructure, 'Infrastructure restaurée avec succès');
    }
}

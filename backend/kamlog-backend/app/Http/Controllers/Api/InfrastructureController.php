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
        $perPage = $request->input('per_page', 15);
        $perPage = min(max($perPage, 1), 100);

        $isAdmin = $request->user() && $request->user()->tokenCan('admin:*');

        $query = Infrastructure::query();

        // Filtrer par statut actif pour le public
        if (!$isAdmin) {
            $query->active();
        }

        // Filtres optionnels
        if ($request->has('type')) {
            $query->ofType($request->input('type'));
        }

        if ($request->has('is_available')) {
            $query->available();
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Tri
        $query->ordered();

        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $request->input('type');

        $infrastructures = $this->remember($cacheKey, function () use ($query, $perPage) {
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
        $infrastructure = Infrastructure::create($request->validated());

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

        $infrastructure->update($request->validated());

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

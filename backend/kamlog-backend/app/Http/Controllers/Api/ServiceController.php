<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use App\Traits\ApiResponses;
use App\Traits\HasCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use ApiResponses, HasCache;
    /**
     * Liste tous les services (public)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $perPage = min(max($perPage, 1), 100);

        $isAdmin = $request->user() && ($request->user()->tokenCan('admin:*') || $request->user()->tokenCan('admin:read'));
        $isActive = $request->input('is_active');

        // Générer une clé de cache unique
        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $isActive;

        $services = $this->remember($cacheKey, function () use ($request, $perPage, $isAdmin) {
            $query = Service::query();

            // Filtrer par statut actif pour le public
            if (!$isAdmin) {
                $query->active();
            }

            // Filtres optionnels
            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            // Tri
            $query->ordered();

            return $query->paginate($perPage);
        }, 1800); // Cache 30 minutes

        return $this->paginatedResponse($services);
    }

    /**
     * Affiche un service spécifique
     */
    public function show(string $id): JsonResponse
    {
        $service = $this->remember('show:' . $id, function () use ($id) {
            return Service::find($id);
        }, 3600); // Cache 1 heure

        if (!$service) {
            return $this->notFoundResponse('Service non trouvé');
        }

        return $this->successResponse($service);
    }

    /**
     * Crée un nouveau service (Admin)
     */
    public function store(ServiceRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());

        // Invalider le cache
        $this->flushCache();

        return $this->createdResponse($service, 'Service créé avec succès');
    }

    /**
     * Met à jour un service (Admin)
     */
    public function update(ServiceRequest $request, string $id): JsonResponse
    {
        $service = Service::find($id);

        if (!$service) {
            return $this->notFoundResponse('Service non trouvé');
        }

        $service->update($request->validated());

        // Invalider le cache
        $this->flushCache();

        return $this->successResponse($service->fresh(), 'Service mis à jour avec succès');
    }

    /**
     * Supprime un service (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $service = Service::find($id);

        if (!$service) {
            return $this->notFoundResponse('Service non trouvé');
        }

        $service->delete();

        // Invalider le cache
        $this->flushCache();

        return $this->successResponse(null, 'Service supprimé avec succès');
    }

    /**
     * Restaure un service supprimé (Admin)
     */
    public function restore(string $id): JsonResponse
    {
        $service = Service::withTrashed()->find($id);

        if (!$service) {
            return $this->notFoundResponse('Service non trouvé');
        }

        if (!$service->trashed()) {
            return $this->errorResponse('Le service n\'est pas supprimé', 400);
        }

        $service->restore();

        // Invalider le cache
        $this->flushCache();

        return $this->successResponse($service, 'Service restauré avec succès');
    }
}

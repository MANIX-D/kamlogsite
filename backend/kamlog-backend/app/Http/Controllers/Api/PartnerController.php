<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use App\Traits\ApiResponses;
use App\Traits\HasCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    use ApiResponses, HasCache;
    /**
     * Liste tous les partenaires (public)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min(max($perPage, 1), 100);

        $isAdmin = $request->user() && $request->user()->tokenCan('admin:*');

        $query = Partner::query();

        // Filtrer par statut actif pour le public
        if (!$isAdmin) {
            $query->active();
        }

        // Filtres optionnels
        if ($request->has('category')) {
            $query->ofCategory($request->input('category'));
        }

        if ($request->has('partnership_level')) {
            $query->ofLevel($request->input('partnership_level'));
        }

        if ($request->has('is_featured')) {
            $query->featured();
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Tri
        $query->ordered();

        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $request->input('category') . ':' . $request->input('partnership_level');

        $partners = $this->remember($cacheKey, function () use ($query, $perPage) {
            return $query->paginate($perPage);
        }, 3600);

        return $this->paginatedResponse($partners);
    }

    /**
     * Affiche un partenaire spécifique
     */
    public function show(string $id): JsonResponse
    {
        $partner = $this->remember('show:' . $id, function () use ($id) {
            return Partner::find($id);
        }, 3600);

        if (!$partner) {
            return $this->notFoundResponse('Partenaire non trouvé');
        }

        return $this->successResponse($partner);
    }

    /**
     * Crée un nouveau partenaire (Admin)
     */
    public function store(PartnerRequest $request): JsonResponse
    {
        $partner = Partner::create($request->validated());

        $this->flushCache();

        return $this->createdResponse($partner, 'Partenaire créé avec succès');
    }

    /**
     * Met à jour un partenaire (Admin)
     */
    public function update(PartnerRequest $request, string $id): JsonResponse
    {
        $partner = Partner::find($id);

        if (!$partner) {
            return $this->notFoundResponse('Partenaire non trouvé');
        }

        $partner->update($request->validated());

        $this->flushCache();

        return $this->successResponse($partner->fresh(), 'Partenaire mis à jour avec succès');
    }

    /**
     * Supprime un partenaire (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $partner = Partner::find($id);

        if (!$partner) {
            return $this->notFoundResponse('Partenaire non trouvé');
        }

        $partner->delete();

        $this->flushCache();

        return $this->successResponse(null, 'Partenaire supprimé avec succès');
    }

    /**
     * Restaure un partenaire supprimé (Admin)
     */
    public function restore(string $id): JsonResponse
    {
        $partner = Partner::withTrashed()->find($id);

        if (!$partner) {
            return $this->notFoundResponse('Partenaire non trouvé');
        }

        if (!$partner->trashed()) {
            return $this->errorResponse('Le partenaire n\'est pas supprimé', 400);
        }

        $partner->restore();

        $this->flushCache();

        return $this->successResponse($partner, 'Partenaire restauré avec succès');
    }
}

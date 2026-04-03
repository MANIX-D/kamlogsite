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
        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);
        $isAdmin = $request->user() && $request->user()->tokenCan('admin:*');
        $category = $request->input('category');
        $level = $request->input('partnership_level');
        $isFeatured = $request->has('is_featured');
        $isActive = $request->input('is_active');

        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $category . ':' . $level . ':' . ($isFeatured ? '1' : '0') . ':' . $isActive;

        $partners = $this->remember($cacheKey, function () use ($perPage, $isAdmin, $category, $level, $isFeatured, $isActive) {
            $query = Partner::query();

            if (!$isAdmin) {
                $query->active();
            }

            if ($category) {
                $query->ofCategory($category);
            }

            if ($level) {
                $query->ofLevel($level);
            }

            if ($isFeatured) {
                $query->featured();
            }

            if ($isActive !== null) {
                $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
            }

            $query->ordered();

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
        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo_url')) {
            $data['logo_url'] = $request->file('logo_url')->store('partners', 'public');
        }

        // Set defaults if not provided
        if (empty($data['category'])) {
            $data['category'] = 'autre';
        }
        if (empty($data['partnership_level'])) {
            $data['partnership_level'] = 'standard';
        }

        $partner = Partner::create($data);

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

        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo_url')) {
            $data['logo_url'] = $request->file('logo_url')->store('partners', 'public');
        }

        $partner->update($data);

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

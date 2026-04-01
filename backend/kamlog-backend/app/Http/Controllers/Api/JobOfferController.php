<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobOfferRequest;
use App\Models\JobOffer;
use App\Traits\ApiResponses;
use App\Traits\HasCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    use ApiResponses, HasCache;
    /**
     * Liste toutes les offres d'emploi (public)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $isAdmin = $request->user() && $request->user()->tokenCan('admin:*');
        $contractType = $request->input('contract_type');
        $experienceLevel = $request->input('experience_level');
        $location = $request->input('location');
        $isUrgent = $request->has('is_urgent');
        $isActive = $request->input('is_active');

        $cacheKey = 'index:' . $perPage . ':' . ($isAdmin ? 'admin' : 'public') . ':' . $contractType . ':' . $experienceLevel . ':' . $location . ':' . ($isUrgent ? '1' : '0') . ':' . $isActive;

        $jobOffers = $this->remember($cacheKey, function () use ($perPage, $isAdmin, $contractType, $experienceLevel, $location, $isUrgent, $isActive) {
            $query = JobOffer::withCount('jobApplications');

            if (!$isAdmin) {
                $query->active()->notExpired();
            }

            if ($contractType) {
                $query->ofContractType($contractType);
            }

            if ($experienceLevel) {
                $query->ofExperienceLevel($experienceLevel);
            }

            if ($location) {
                $sanitized = str_replace(['%', '_'], ['\%', '\_'], $location);
                $query->where('location', 'like', '%' . $sanitized . '%');
            }

            if ($isUrgent) {
                $query->urgent();
            }

            if ($isActive !== null) {
                $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
            }

            $query->latest();

            return $query->paginate($perPage);
        }, 1800);

        return $this->paginatedResponse($jobOffers);
    }

    /**
     * Affiche une offre d'emploi spécifique
     */
    public function show(string $id): JsonResponse
    {
        $jobOffer = $this->remember('show:' . $id, function () use ($id) {
            return JobOffer::withCount('jobApplications')->find($id);
        }, 1800);

        if (!$jobOffer) {
            return $this->notFoundResponse('Offre d\'emploi non trouvée');
        }

        return $this->successResponse($jobOffer);
    }

    /**
     * Crée une nouvelle offre d'emploi (Admin)
     */
    public function store(JobOfferRequest $request): JsonResponse
    {
        $jobOffer = JobOffer::create($request->validated());

        $this->flushCache();

        return $this->createdResponse($jobOffer, 'Offre d\'emploi créée avec succès');
    }

    /**
     * Met à jour une offre d'emploi (Admin)
     */
    public function update(JobOfferRequest $request, string $id): JsonResponse
    {
        $jobOffer = JobOffer::find($id);

        if (!$jobOffer) {
            return $this->notFoundResponse('Offre d\'emploi non trouvée');
        }

        $jobOffer->update($request->validated());

        $this->flushCache();

        return $this->successResponse($jobOffer->fresh(), 'Offre d\'emploi mise à jour avec succès');
    }

    /**
     * Supprime une offre d'emploi (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $jobOffer = JobOffer::find($id);

        if (!$jobOffer) {
            return $this->notFoundResponse('Offre d\'emploi non trouvée');
        }

        $jobOffer->delete();

        $this->flushCache();

        return $this->successResponse(null, 'Offre d\'emploi supprimée avec succès');
    }

    /**
     * Restaure une offre d'emploi supprimée (Admin)
     */
    public function restore(string $id): JsonResponse
    {
        $jobOffer = JobOffer::withTrashed()->find($id);

        if (!$jobOffer) {
            return $this->notFoundResponse('Offre d\'emploi non trouvée');
        }

        if (!$jobOffer->trashed()) {
            return $this->errorResponse('L\'offre d\'emploi n\'est pas supprimée', 400);
        }

        $jobOffer->restore();

        $this->flushCache();

        return $this->successResponse($jobOffer, 'Offre d\'emploi restaurée avec succès');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobOffer;
use App\Models\News;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends Controller
{
    use ApiResponses;

    /**
     * Liste des candidatures (Admin)
     */
    public function index(Request $request): JsonResponse
    {
        $query = JobApplication::with(['jobOffer']);

        // Filtrer par statut
        if ($request->has('status')) {
            $query->ofStatus($request->input('status'));
        }

        // Filtrer par offre d'emploi
        if ($request->has('job_offer_id')) {
            $query->where('job_offer_id', $request->input('job_offer_id'));
        }

        // Tri
        $query->orderBy('application_date', 'desc');

        $applications = $query->paginate($request->input('per_page', 20));

        return $this->paginatedResponse($applications);
    }

    /**
     * Afficher une candidature spécifique (Admin)
     */
    public function show(string $id): JsonResponse
    {
        $application = JobApplication::with(['jobOffer'])->find($id);

        if (!$application) {
            return $this->notFoundResponse('Candidature non trouvée');
        }

        return $this->successResponse($application);
    }

    /**
     * Soumettre une candidature (Public)
     */
    public function store(Request $request, string $jobId): JsonResponse
    {
        // Check if job offer exists in News table (type='offre')
        $jobOffer = News::where('id', $jobId)->where('type', 'offre')->first();

        if (!$jobOffer) {
            return $this->notFoundResponse('Offre d\'emploi non trouvée');
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'cv' => ['required', 'file', 'mimes:pdf', 'max:5120'], // 5MB max
            'cover_letter' => ['nullable', 'string', 'max:5000'],
        ], [
            'first_name.required' => 'Le prénom est requis.',
            'last_name.required' => 'Le nom est requis.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être valide.',
            'phone.required' => 'Le téléphone est requis.',
            'cv.required' => 'Le CV est requis.',
            'cv.mimes' => 'Le CV doit être un fichier PDF.',
            'cv.max' => 'Le CV ne doit pas dépasser 5 Mo.',
        ]);

        // Store CV file
        $cvPath = $request->file('cv')->store('cvs', 'public');

        $application = JobApplication::create([
            'job_offer_id' => $jobOffer->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'cv_path' => $cvPath,
            'cover_letter' => $validated['cover_letter'] ?? null,
        ]);

        return $this->createdResponse($application, 'Candidature envoyée avec succès');
    }

    /**
     * Mettre à jour le statut d'une candidature (Admin)
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $application = JobApplication::find($id);

        if (!$application) {
            return $this->notFoundResponse('Candidature non trouvée');
        }

        $validated = $request->validate([
            'status' => ['required', 'in:en_attente,en_cours,acceptee,refusee'],
            'notes_admin' => ['nullable', 'string'],
        ]);

        $application->update([
            'status' => $validated['status'],
            'notes_admin' => $validated['notes_admin'] ?? $application->notes_admin,
            'user_id' => $request->user()->id ?? null,
        ]);

        return $this->successResponse($application, 'Statut mis à jour avec succès');
    }

    /**
     * Supprimer une candidature (Admin)
     */
    public function destroy(string $id): JsonResponse
    {
        $application = JobApplication::find($id);

        if (!$application) {
            return $this->notFoundResponse('Candidature non trouvée');
        }

        // Delete CV file if exists
        if ($application->cv_path && Storage::disk('public')->exists($application->cv_path)) {
            Storage::disk('public')->delete($application->cv_path);
        }

        $application->delete();

        return $this->successResponse(null, 'Candidature supprimée avec succès');
    }
}

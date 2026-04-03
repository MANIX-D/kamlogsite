<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobOffer;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends Controller
{
    use ApiResponses;

    /**
     * Soumettre une candidature (Public)
     */
    public function store(Request $request, string $jobId): JsonResponse
    {
        $jobOffer = JobOffer::find($jobId);

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
}

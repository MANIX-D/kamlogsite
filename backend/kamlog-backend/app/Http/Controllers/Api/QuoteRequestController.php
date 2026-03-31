<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuoteRequestRequest;
use App\Http\Requests\UpdateQuoteRequestRequest;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuoteRequestController extends Controller
{
    /**
     * Liste toutes les demandes de devis (Admin uniquement)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min(max($perPage, 1), 100);

        $query = QuoteRequest::with('user');

        // Filtres optionnels
        if ($request->has('status')) {
            $query->ofStatus($request->input('status'));
        }

        if ($request->has('service_type')) {
            $query->ofServiceType($request->input('service_type'));
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->input('date_from'));
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->input('date_to'));
        }

        // Tri par date
        $query->latest();

        $quoteRequests = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $quoteRequests->items(),
            'pagination' => [
                'total' => $quoteRequests->total(),
                'per_page' => $quoteRequests->perPage(),
                'current_page' => $quoteRequests->currentPage(),
                'last_page' => $quoteRequests->lastPage(),
                'from' => $quoteRequests->firstItem(),
                'to' => $quoteRequests->lastItem(),
            ],
        ], 200);
    }

    /**
     * Affiche une demande de devis spécifique (Admin)
     */
    public function show(string $id): JsonResponse
    {
        $quoteRequest = QuoteRequest::with('user')->find($id);

        if (!$quoteRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de devis non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $quoteRequest,
        ], 200);
    }

    /**
     * Crée une nouvelle demande de devis (Public)
     */
    public function store(QuoteRequestRequest $request): JsonResponse
    {
        // Vérifier le rate limiting par IP (max 3 demandes par jour)
        $recentRequests = QuoteRequest::where('ip_address', $request->ip())
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($recentRequests >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez atteint la limite de demandes de devis pour aujourd\'hui.',
            ], 429);
        }

        $data = $request->validated();
        $data['ip_address'] = $request->ip();

        $quoteRequest = QuoteRequest::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Votre demande de devis a été enregistrée avec succès. Nous vous contacterons dans les plus brefs délais.',
            'data' => $quoteRequest,
        ], 201);
    }

    /**
     * Met à jour une demande de devis (Admin - pour statut et montant)
     */
    public function update(UpdateQuoteRequestRequest $request, string $id): JsonResponse
    {
        $quoteRequest = QuoteRequest::find($id);

        if (!$quoteRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de devis non trouvée',
            ], 404);
        }

        $validated = $request->validated();
        $quoteRequest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Demande de devis mise à jour avec succès',
            'data' => $quoteRequest->fresh('user'),
        ], 200);
    }

    /**
     * Supprime une demande de devis (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $quoteRequest = QuoteRequest::find($id);

        if (!$quoteRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de devis non trouvée',
            ], 404);
        }

        $quoteRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Demande de devis supprimée avec succès',
        ], 200);
    }
}

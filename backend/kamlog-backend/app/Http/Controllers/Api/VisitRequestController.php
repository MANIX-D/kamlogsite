<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VisitRequestRequest;
use App\Http\Requests\UpdateVisitRequestRequest;
use App\Models\VisitRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitRequestController extends Controller
{
    /**
     * Liste toutes les demandes de visite (Admin uniquement)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min(max($perPage, 1), 100);

        $query = VisitRequest::with(['infrastructure', 'user']);

        // Filtres optionnels
        if ($request->has('status')) {
            $query->ofStatus($request->input('status'));
        }

        if ($request->has('type_visite')) {
            $query->ofType($request->input('type_visite'));
        }

        if ($request->has('infrastructure_id')) {
            $query->where('infrastructure_id', $request->input('infrastructure_id'));
        }

        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->input('date_from'));
        }

        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->input('date_to'));
        }

        // Tri par date
        $query->latest('date');

        $visitRequests = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $visitRequests->items(),
            'pagination' => [
                'total' => $visitRequests->total(),
                'per_page' => $visitRequests->perPage(),
                'current_page' => $visitRequests->currentPage(),
                'last_page' => $visitRequests->lastPage(),
                'from' => $visitRequests->firstItem(),
                'to' => $visitRequests->lastItem(),
            ],
        ], 200);
    }

    /**
     * Affiche une demande de visite spécifique (Admin)
     */
    public function show(string $id): JsonResponse
    {
        $visitRequest = VisitRequest::with(['infrastructure', 'user'])->find($id);

        if (!$visitRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de visite non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $visitRequest,
        ], 200);
    }

    /**
     * Crée une nouvelle demande de visite (Public)
     */
    public function store(VisitRequestRequest $request): JsonResponse
    {
        // Vérifier le rate limiting par IP (max 5 demandes par jour)
        $recentRequests = VisitRequest::where('ip_address', $request->ip())
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($recentRequests >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez atteint la limite de demandes de visite pour aujourd\'hui.',
            ], 429);
        }

        $data = $request->validated();
        $data['ip_address'] = $request->ip();

        $visitRequest = VisitRequest::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Votre demande de visite a été enregistrée avec succès. Nous vous contacterons bientôt.',
            'data' => $visitRequest,
        ], 201);
    }

    /**
     * Met à jour une demande de visite (Admin - pour statut et assignation)
     */
    public function update(UpdateVisitRequestRequest $request, string $id): JsonResponse
    {
        $visitRequest = VisitRequest::find($id);

        if (!$visitRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de visite non trouvée',
            ], 404);
        }

        $validated = $request->validated();
        $visitRequest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Demande de visite mise à jour avec succès',
            'data' => $visitRequest->fresh(['infrastructure', 'user']),
        ], 200);
    }

    /**
     * Confirme une demande de visite (Admin)
     */
    public function confirm(string $id): JsonResponse
    {
        $visitRequest = VisitRequest::find($id);

        if (!$visitRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de visite non trouvée',
            ], 404);
        }

        $visitRequest->update(['status' => 'confirmed']);

        return response()->json([
            'success' => true,
            'message' => 'Demande de visite confirmée',
            'data' => $visitRequest,
        ], 200);
    }

    /**
     * Annule une demande de visite (Admin ou Public avec token)
     */
    public function cancel(string $id): JsonResponse
    {
        $visitRequest = VisitRequest::find($id);

        if (!$visitRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de visite non trouvée',
            ], 404);
        }

        $visitRequest->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Demande de visite annulée',
            'data' => $visitRequest,
        ], 200);
    }

    /**
     * Supprime une demande de visite (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $visitRequest = VisitRequest::find($id);

        if (!$visitRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de visite non trouvée',
            ], 404);
        }

        $visitRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Demande de visite supprimée avec succès',
        ], 200);
    }
}

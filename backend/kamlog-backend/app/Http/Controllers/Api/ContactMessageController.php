<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactMessageRequest;
use App\Http\Requests\UpdateContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    /**
     * Liste tous les messages de contact (Admin uniquement)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min(max($perPage, 1), 100);

        $query = ContactMessage::query();

        // Filtres optionnels
        if ($request->has('statut')) {
            $query->ofStatus($request->input('statut'));
        }

        if ($request->has('lu')) {
            if ($request->boolean('lu')) {
                $query->read();
            } else {
                $query->unread();
            }
        }

        // Tri par date (plus récents en premier)
        $query->latest();

        $messages = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $messages->items(),
            'pagination' => [
                'total' => $messages->total(),
                'per_page' => $messages->perPage(),
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'from' => $messages->firstItem(),
                'to' => $messages->lastItem(),
            ],
        ], 200);
    }

    /**
     * Affiche un message de contact spécifique (Admin)
     */
    public function show(string $id): JsonResponse
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        // Marquer comme lu automatiquement
        if (!$message->lu) {
            $message->markAsRead();
        }

        return response()->json([
            'success' => true,
            'data' => $message,
        ], 200);
    }

    /**
     * Crée un nouveau message de contact (Public)
     */
    public function store(ContactMessageRequest $request): JsonResponse
    {
        // Vérifier le rate limiting par IP (max 3 messages par heure)
        $recentMessages = ContactMessage::where('ip_address', $request->ip())
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($recentMessages >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez atteint la limite de messages. Veuillez réessayer dans une heure.',
            ], 429);
        }

        $data = $request->validated();
        $data['ip_address'] = $request->ip();

        $message = ContactMessage::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            'data' => $message,
        ], 201);
    }

    /**
     * Met à jour un message de contact (Admin - pour réponse et statut)
     */
    public function update(UpdateContactMessageRequest $request, string $id): JsonResponse
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        $validated = $request->validated();

        // Si une réponse est ajoutée, mettre à jour la date de réponse
        if (isset($validated['reponse']) && $validated['reponse']) {
            $validated['date_reponse'] = now();
        }

        $message->update($validated);

        // Invalider le cache du dashboard
        \Illuminate\Support\Facades\Cache::forget('dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Message mis à jour avec succès',
            'data' => $message->fresh(),
        ], 200);
    }

    /**
     * Marque un message comme lu (Admin)
     */
    public function markAsRead(string $id): JsonResponse
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        $message->markAsRead();

        // Invalider le cache du dashboard
        \Illuminate\Support\Facades\Cache::forget('dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Message marqué comme lu',
            'data' => $message,
        ], 200);
    }

    /**
     * Supprime un message de contact (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        $message->delete();

        // Invalider le cache du dashboard
        \Illuminate\Support\Facades\Cache::forget('dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Message supprimé avec succès',
        ], 200);
    }
}

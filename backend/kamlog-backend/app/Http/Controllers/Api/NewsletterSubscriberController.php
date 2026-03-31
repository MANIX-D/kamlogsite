<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsletterSubscriberRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterSubscriberController extends Controller
{
    /**
     * Liste tous les abonnés (Admin uniquement)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 50);
        $perPage = min(max($perPage, 1), 100);

        $query = NewsletterSubscriber::query();

        // Filtres optionnels
        if ($request->has('statut')) {
            $query->ofStatus($request->input('statut'));
        }

        // Tri par date d'inscription
        $query->latest('date_inscription');

        $subscribers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $subscribers->items(),
            'pagination' => [
                'total' => $subscribers->total(),
                'per_page' => $subscribers->perPage(),
                'current_page' => $subscribers->currentPage(),
                'last_page' => $subscribers->lastPage(),
                'from' => $subscribers->firstItem(),
                'to' => $subscribers->lastItem(),
            ],
        ], 200);
    }

    /**
     * Inscription à la newsletter (Public)
     */
    public function subscribe(NewsletterSubscriberRequest $request): JsonResponse
    {
        // Vérifier le rate limiting par IP (max 5 inscriptions par jour)
        $recentSubscriptions = NewsletterSubscriber::where('ip_address', $request->ip())
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($recentSubscriptions >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez atteint la limite d\'inscriptions pour aujourd\'hui.',
            ], 429);
        }

        $data = $request->validated();
        $data['ip_address'] = $request->ip();

        $subscriber = NewsletterSubscriber::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Vous êtes maintenant inscrit à notre newsletter !',
            'data' => [
                'email' => $subscriber->email,
                'date_inscription' => $subscriber->date_inscription,
            ],
        ], 201);
    }

    /**
     * Désinscription de la newsletter (Public - par token)
     */
    public function unsubscribe(string $token): JsonResponse
    {
        $subscriber = NewsletterSubscriber::where('token_desinscription', $token)->first();

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Lien de désinscription invalide',
            ], 404);
        }

        if ($subscriber->statut === 'desinscrit') {
            return response()->json([
                'success' => false,
                'message' => 'Vous êtes déjà désinscrit de la newsletter',
            ], 400);
        }

        $subscriber->unsubscribe();

        return response()->json([
            'success' => true,
            'message' => 'Vous avez été désinscrit de la newsletter avec succès',
        ], 200);
    }

    /**
     * Affiche un abonné spécifique (Admin)
     */
    public function show(string $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::find($id);

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Abonné non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $subscriber,
        ], 200);
    }

    /**
     * Supprime un abonné (Admin - soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::find($id);

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Abonné non trouvé',
            ], 404);
        }

        $subscriber->delete();

        return response()->json([
            'success' => true,
            'message' => 'Abonné supprimé avec succès',
        ], 200);
    }
}

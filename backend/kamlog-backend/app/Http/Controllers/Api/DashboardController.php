<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\News;
use App\Models\Service;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponses;

    /**
     * Statistiques du tableau de bord admin
     *
     * Optimisé : 4 requêtes avec agrégation conditionnelle au lieu de 8 COUNT séparés.
     */
    public function stats(): JsonResponse
    {
        $stats = Cache::remember('dashboard:stats', 300, function () {
            $serviceCounts = Service::query()
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('SUM(CASE WHEN is_active = 1 AND deleted_at IS NULL THEN 1 ELSE 0 END) as active')
                ->first();

            $newsCounts = News::query()
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('SUM(CASE WHEN is_published = 1 AND deleted_at IS NULL THEN 1 ELSE 0 END) as published')
                ->first();

            $messageCounts = ContactMessage::query()
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('SUM(CASE WHEN lu = 0 AND deleted_at IS NULL THEN 1 ELSE 0 END) as unread')
                ->first();

            $userCounts = User::query()
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('SUM(CASE WHEN is_active = 1 AND deleted_at IS NULL THEN 1 ELSE 0 END) as active')
                ->first();

            return [
                'total_services' => (int) $serviceCounts->total,
                'active_services' => (int) $serviceCounts->active,
                'total_news' => (int) $newsCounts->total,
                'published_news' => (int) $newsCounts->published,
                'total_messages' => (int) $messageCounts->total,
                'unread_messages' => (int) $messageCounts->unread,
                'total_users' => (int) $userCounts->total,
                'active_users' => (int) $userCounts->active,
            ];
        });

        return $this->successResponse($stats, 'Statistiques du tableau de bord');
    }
}

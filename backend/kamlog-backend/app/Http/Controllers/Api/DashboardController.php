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

class DashboardController extends Controller
{
    use ApiResponses;

    /**
     * Statistiques du tableau de bord admin
     */
    public function stats(): JsonResponse
    {
        $stats = Cache::remember('dashboard:stats', 300, function () {
            return [
                'total_services' => Service::count(),
                'total_news' => News::count(),
                'total_messages' => ContactMessage::count(),
                'total_users' => User::count(),
                'unread_messages' => ContactMessage::unread()->count(),
                'active_services' => Service::active()->count(),
                'published_news' => News::published()->count(),
                'active_users' => User::active()->count(),
            ];
        });

        return $this->successResponse($stats, 'Statistiques du tableau de bord');
    }
}

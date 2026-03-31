<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuthLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MetricsController extends Controller
{
    /**
     * Obtenir les métriques d'authentification du jour
     */
    public function today(Request $request): JsonResponse
    {
        $metrics = AuthLogService::getTodayMetrics();

        return response()->json([
            'success' => true,
            'data' => [
                'date' => now()->format('Y-m-d'),
                'metrics' => $metrics,
                'summary' => [
                    'total_logins' => $metrics['login_success'] + $metrics['login_failed'],
                    'success_rate' => $metrics['login_success'] > 0 
                        ? round(($metrics['login_success'] / ($metrics['login_success'] + $metrics['login_failed'])) * 100, 2)
                        : 0,
                ],
            ],
        ], 200);
    }

    /**
     * Obtenir les métriques sur une période
     */
    public function period(Request $request): JsonResponse
    {
        $days = $request->input('days', 7);
        $days = min(max($days, 1), 30); // Entre 1 et 30 jours

        $metrics = AuthLogService::getMetricsForPeriod($days);

        return response()->json([
            'success' => true,
            'data' => [
                'period' => $days,
                'metrics' => $metrics,
            ],
        ], 200);
    }
}

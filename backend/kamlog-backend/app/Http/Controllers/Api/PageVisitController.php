<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageVisit;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PageVisitController extends Controller
{
    use ApiResponses;

    /**
     * Enregistrer une visite de page (route publique)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'required|string|max:255',
        ]);

        PageVisit::create([
            'page'       => $request->input('page'),
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? '', 0, 512),
            'referrer'   => substr($request->input('referrer', $request->header('Referer', '')), 0, 512),
            'visited_at' => now(),
        ]);

        // Invalider le cache des stats
        Cache::forget('page_visits:stats');

        return response()->json(['success' => true], 201);
    }

    /**
     * Statistiques des visites (route admin protégée)
     */
    public function stats(): JsonResponse
    {
        $stats = Cache::remember('page_visits:stats', 10, function () {
            $today = now()->toDateString();
            $weekStart = now()->startOfWeek()->toDateTimeString();
            $monthStart = now()->startOfMonth()->toDateTimeString();

            // Compteurs globaux
            $todayCount = PageVisit::whereDate('visited_at', $today)->count();
            $weekCount = PageVisit::where('visited_at', '>=', $weekStart)->count();
            $monthCount = PageVisit::where('visited_at', '>=', $monthStart)->count();
            $totalCount = PageVisit::count();

            // Visiteurs uniques (par IP)
            $todayUnique = PageVisit::whereDate('visited_at', $today)->distinct('ip_address')->count('ip_address');
            $weekUnique = PageVisit::where('visited_at', '>=', $weekStart)->distinct('ip_address')->count('ip_address');
            $monthUnique = PageVisit::where('visited_at', '>=', $monthStart)->distinct('ip_address')->count('ip_address');

            // Visites par jour (30 derniers jours) pour le graphique
            $dailyVisits = PageVisit::select(
                    DB::raw('DATE(visited_at) as date'),
                    DB::raw('COUNT(*) as visits'),
                    DB::raw('COUNT(DISTINCT ip_address) as unique_visitors')
                )
                ->where('visited_at', '>=', now()->subDays(30)->startOfDay())
                ->groupBy(DB::raw('DATE(visited_at)'))
                ->orderBy('date')
                ->get();

            // Pages les plus visitées (ce mois)
            $topPages = PageVisit::select(
                    'page',
                    DB::raw('COUNT(*) as visits')
                )
                ->where('visited_at', '>=', $monthStart)
                ->groupBy('page')
                ->orderByDesc('visits')
                ->limit(10)
                ->get();

            return [
                'today'        => $todayCount,
                'this_week'    => $weekCount,
                'this_month'   => $monthCount,
                'total'        => $totalCount,
                'today_unique' => $todayUnique,
                'week_unique'  => $weekUnique,
                'month_unique' => $monthUnique,
                'daily_chart'  => $dailyVisits,
                'top_pages'    => $topPages,
            ];
        });

        return $this->successResponse($stats, 'Statistiques des visites');
    }
}

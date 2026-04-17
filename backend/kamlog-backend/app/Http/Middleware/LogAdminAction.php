<?php

namespace App\Http\Middleware;

use App\Models\AdminActionLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogAdminAction
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return $response;
        }

        if (!$this->shouldLog($request, $response)) {
            return $response;
        }

        AdminActionLog::create([
            'user_id' => $user->id,
            'action' => $this->buildAction($request),
            'method' => $request->method(),
            'route' => '/' . ltrim($request->path(), '/'),
            'description' => $this->buildDescription($request),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata' => [
                'route_name' => $request->route()?->getName(),
                'params' => $request->route()?->parameters() ?? [],
            ],
        ]);

        return $response;
    }

    private function shouldLog(Request $request, Response $response): bool
    {
        if ($response->getStatusCode() >= 400) {
            return false;
        }

        if (!str_starts_with($request->path(), 'api/v1/admin/')) {
            return false;
        }

        if (in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'], true)) {
            return false;
        }

        if (str_contains($request->path(), '/auth/refresh')) {
            return false;
        }

        return true;
    }

    private function buildAction(Request $request): string
    {
        $segments = array_values(array_filter(explode('/', $request->path())));
        $segments = array_slice($segments, 2);
        $resource = $segments[1] ?? ($segments[0] ?? 'dashboard');
        $resource = str_replace('-', ' ', $resource);

        return match ($request->method()) {
            'POST' => "Création / action sur {$resource}",
            'PUT', 'PATCH' => "Modification de {$resource}",
            'DELETE' => "Suppression de {$resource}",
            default => "Action sur {$resource}",
        };
    }

    private function buildDescription(Request $request): string
    {
        $segments = array_values(array_filter(explode('/', $request->path())));
        $resource = $segments[3] ?? ($segments[2] ?? 'ressource');
        $resource = str_replace('-', ' ', $resource);

        return match ($request->method()) {
            'POST' => "Action POST effectuée sur {$resource}",
            'PUT', 'PATCH' => "Mise à jour effectuée sur {$resource}",
            'DELETE' => "Suppression effectuée sur {$resource}",
            default => "Action effectuée sur {$resource}",
        };
    }
}

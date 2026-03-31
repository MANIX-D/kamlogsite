<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddSecurityHeaders
{
    /**
     * Ajouter les headers de sécurité à toutes les réponses API
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // ── Protection contre le MIME sniffing ──
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // ── Protection contre le clickjacking ──
        $response->headers->set('X-Frame-Options', 'DENY');

        // ── Protection XSS navigateur (legacy, mais toujours utile) ──
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // ── Content Security Policy (adaptée pour une API JSON) ──
        $response->headers->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

        // ── Referrer Policy ──
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // ── Permissions Policy (désactiver les APIs navigateur non nécessaires) ──
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');

        // ── Cacher les informations serveur ──
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        // ── HSTS (uniquement en HTTPS) — 1 an avec preload ──
        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // ── Cross-Origin policies ──
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');

        // ── Ne pas exposer le temps de réponse en production ──
        if (app()->isProduction()) {
            $response->headers->remove('X-Response-Time');
        }

        return $response;
    }
}

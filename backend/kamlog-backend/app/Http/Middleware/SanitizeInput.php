<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    /**
     * Champs qui ne doivent PAS être nettoyés (ex: mot de passe, HTML autorisé)
     */
    protected array $except = [
        'password',
        'password_confirmation',
        'current_password',
    ];

    /**
     * Champs qui peuvent contenir du HTML limité (nettoyage partiel)
     */
    protected array $allowHtmlFields = [
        'project_description',
        'cover_letter',
        'reponse',
    ];

    /**
     * Tags HTML autorisés dans les champs allowHtml
     */
    protected array $allowedTags = [
        '<p>', '<br>', '<strong>', '<em>', '<ul>', '<ol>', '<li>', '<a>', '<h3>', '<h4>',
    ];

    /**
     * Nettoyer toutes les entrées utilisateur
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        $cleaned = $this->cleanArray($input);

        $request->merge($cleaned);

        return $next($request);
    }

    /**
     * Nettoyer un tableau de données récursivement
     */
    protected function cleanArray(array $data, string $prefix = ''): array
    {
        $cleaned = [];

        foreach ($data as $key => $value) {
            $fullKey = $prefix ? "{$prefix}.{$key}" : $key;

            if (in_array($key, $this->except, true)) {
                $cleaned[$key] = $value;
                continue;
            }

            if (is_array($value)) {
                $cleaned[$key] = $this->cleanArray($value, $fullKey);
            } elseif (is_string($value)) {
                $cleaned[$key] = $this->cleanString($value, $key);
            } else {
                $cleaned[$key] = $value;
            }
        }

        return $cleaned;
    }

    /**
     * Nettoyer une chaîne de caractères
     */
    protected function cleanString(string $value, string $key): string
    {
        // Supprimer les caractères null bytes (injection)
        $value = str_replace(chr(0), '', $value);

        // Supprimer les caractères de contrôle invisibles (sauf newline, tab)
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);

        // Trim les espaces
        $value = trim($value);

        // Champs avec HTML limité autorisé
        if (in_array($key, $this->allowHtmlFields, true)) {
            return $this->cleanHtml($value);
        }

        // Nettoyage complet : supprimer tous les tags HTML
        // Note: pas de htmlspecialchars() — JSON encoding gère l'échappement,
        // et encoder ici corromprait les données stockées (O'Brien → O&#039;Brien)
        $value = strip_tags($value);

        return $value;
    }

    /**
     * Nettoyage HTML partiel (tags autorisés uniquement)
     */
    protected function cleanHtml(string $value): string
    {
        // Supprimer les event handlers JS (onclick, onerror, onload, etc.)
        $value = preg_replace('/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $value);
        $value = preg_replace('/\s*on\w+\s*=\s*\S+/i', '', $value);

        // Supprimer les balises script, style, iframe, object, embed, form
        $value = preg_replace('#<(script|style|iframe|object|embed|form|base|link|meta)[^>]*>.*?</\1>#is', '', $value);
        $value = preg_replace('#<(script|style|iframe|object|embed|form|base|link|meta)[^>]*/?\s*>#is', '', $value);

        // Supprimer les protocoles dangereux dans les href/src
        $value = preg_replace('/(?:href|src)\s*=\s*["\']?\s*(?:javascript|vbscript|data):/i', 'href="removed:', $value);

        // Garder uniquement les tags autorisés
        $allowedTagsStr = implode('', $this->allowedTags);
        $value = strip_tags($value, $allowedTagsStr);

        return $value;
    }
}

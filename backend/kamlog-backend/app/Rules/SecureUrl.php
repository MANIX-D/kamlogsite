<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SecureUrl implements ValidationRule
{
    protected array $allowedProtocols = ['http', 'https'];
    protected bool $requireHttps = false;

    public function __construct(bool $requireHttps = false)
    {
        $this->requireHttps = $requireHttps;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('L\'URL doit être une chaîne de caractères.');
            return;
        }

        // Vérifier que c'est une URL valide
        if (!filter_var($value, FILTER_VALIDATE_URL)) {
            $fail('L\'URL n\'est pas valide.');
            return;
        }

        // Extraire le protocole
        $parsedUrl = parse_url($value);
        
        if (!isset($parsedUrl['scheme'])) {
            $fail('L\'URL doit contenir un protocole (http:// ou https://).');
            return;
        }

        $protocol = strtolower($parsedUrl['scheme']);

        // Vérifier le protocole
        if (!in_array($protocol, $this->allowedProtocols)) {
            $fail('Le protocole doit être http:// ou https://.');
            return;
        }

        // Forcer HTTPS si requis
        if ($this->requireHttps && $protocol !== 'https') {
            $fail('L\'URL doit utiliser le protocole HTTPS.');
            return;
        }

        // Vérifier qu'il y a un domaine
        if (!isset($parsedUrl['host']) || empty($parsedUrl['host'])) {
            $fail('L\'URL doit contenir un nom de domaine valide.');
            return;
        }

        // Vérifier que le domaine contient au moins un point
        if (!str_contains($parsedUrl['host'], '.')) {
            $fail('Le nom de domaine doit être valide (ex: example.com).');
            return;
        }

        // Bloquer les IPs locales en production
        if (app()->environment('production')) {
            $host = $parsedUrl['host'];
            
            // Bloquer localhost et IPs privées
            if (in_array($host, ['localhost', '127.0.0.1', '0.0.0.0']) ||
                str_starts_with($host, '192.168.') ||
                str_starts_with($host, '10.') ||
                preg_match('/^172\.(1[6-9]|2[0-9]|3[0-1])\./', $host)) {
                $fail('Les URLs locales ne sont pas autorisées en production.');
                return;
            }
        }
    }
}

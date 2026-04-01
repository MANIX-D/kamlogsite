<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Exceptions\ThrottleRequestsException;

abstract class BaseFormRequest extends FormRequest
{
    /**
     * Vérifier l'autorisation admin avec rôles spécifiques
     */
    protected function authorizeAdmin(array $roles = ['super_admin', 'admin']): bool
    {
        $user = $this->user();
        
        return $user !== null && 
               $user->tokenCan('admin:*') &&
               isset($user->role) &&
               in_array($user->role, $roles, true);
    }

    /**
     * Vérifier l'autorisation publique avec rate limiting
     */
    protected function authorizePublic(int $maxAttempts = 5, int $decayMinutes = 1): bool
    {
        $key = 'form-submit:' . $this->ip() . ':' . static::class;
        
        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);
            throw new ThrottleRequestsException(
                "Trop de tentatives. Veuillez réessayer dans {$seconds} secondes."
            );
        }
        
        RateLimiter::hit($key, $decayMinutes * 60);
        
        return true;
    }

    /**
     * Règles de validation communes pour les URLs
     */
    protected function urlRules(bool $required = false, int $maxLength = 500): array
    {
        $rules = $required ? ['required'] : ['nullable'];
        
        return array_merge($rules, [
            'string',
            'url',
            'min:10',
            'max:' . $maxLength,
            'regex:/^https?:\/\/.+\..+/i',
        ]);
    }

    /**
     * Règles de validation communes pour les slugs
     */
    protected function slugRules(string $table, bool $required = true, ?int $ignoreId = null): array
    {
        $rules = $required ? ['required'] : ['nullable'];
        
        $uniqueRule = \Illuminate\Validation\Rule::unique($table, 'slug')
            ->whereNull('deleted_at');
            
        if ($ignoreId !== null) {
            $uniqueRule->ignore($ignoreId);
        }
        
        return array_merge($rules, [
            'string',
            new \App\Rules\ValidSlug(),
            $uniqueRule,
        ]);
    }

    /**
     * Règles de validation pour les enums
     */
    protected function enumRules(string $enumClass, bool $required = true): array
    {
        $rules = $required ? ['required'] : ['nullable'];
        
        if (!enum_exists($enumClass)) {
            throw new \InvalidArgumentException("La classe {$enumClass} n'est pas un enum valide.");
        }

        return array_merge($rules, [
            'string',
            \Illuminate\Validation\Rule::in($enumClass::values()),
        ]);
    }

    /**
     * Sanitize HTML content
     */
    protected function sanitizeHtml(?string $html, array $allowedTags = []): ?string
    {
        if ($html === null) {
            return null;
        }

        $defaultAllowedTags = '<p><br><strong><em><ul><ol><li><a><h1><h2><h3><h4><blockquote><code><pre>';
        $allowed = empty($allowedTags) ? $defaultAllowedTags : '<' . implode('><', $allowedTags) . '>';
        
        return strip_tags($html, $allowed);
    }

    /**
     * Générer un extrait sécurisé à partir du contenu
     */
    protected function generateExcerpt(?string $content, int $length = 200): ?string
    {
        if ($content === null) {
            return null;
        }

        $cleanContent = trim(strip_tags($content));
        
        if (strlen($cleanContent) === 0) {
            return null;
        }

        $excerpt = substr($cleanContent, 0, $length);
        
        if (strlen($cleanContent) > $length) {
            $excerpt .= '...';
        }
        
        return $excerpt;
    }

    /**
     * Obtenir le nom complet de l'utilisateur de manière sécurisée
     */
    protected function getUserFullName(): ?string
    {
        $user = $this->user();
        
        if ($user === null) {
            return null;
        }

        $nom = isset($user->nom) ? $user->nom : '';
        $prenom = isset($user->prenom) ? $user->prenom : '';
        
        $fullName = trim($nom . ' ' . $prenom);
        
        return $fullName !== '' ? $fullName : null;
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        throw new \Illuminate\Auth\Access\AuthorizationException(
            $this->getAuthorizationErrorMessage()
        );
    }

    /**
     * Get the authorization error message.
     */
    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation d\'effectuer cette action.';
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        $errors = $validator->errors();
        
        // Logger les erreurs de validation en production
        if (app()->environment('production')) {
            \Log::channel('api')->warning('Validation failed', [
                'request_class' => static::class,
                'errors' => $errors->toArray(),
                'ip' => $this->ip(),
                'user_agent' => $this->userAgent(),
            ]);
            
            // Limiter les détails exposés si configuré
            if (config('app.hide_validation_details', false)) {
                $errors = ['message' => 'Les données fournies sont invalides.'];
            }
        }

        throw new \Illuminate\Validation\ValidationException(
            $validator,
            response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $errors,
            ], 422)
        );
    }

    /**
     * Obtenir les règles de validation avec cache
     */
    protected function getCachedRules(): array
    {
        // En production, mettre en cache les règles de validation
        if (app()->environment('production')) {
            $cacheKey = 'validation_rules:' . static::class;
            
            return \Cache::remember($cacheKey, 3600, function () {
                return $this->rules();
            });
        }

        return $this->rules();
    }

    /**
     * Nettoyer les données avant validation
     */
    protected function sanitizeInput(): void
    {
        // Trim tous les strings
        $input = $this->all();
        
        array_walk_recursive($input, function (&$value) {
            if (is_string($value)) {
                $value = trim($value);
            }
        });

        $this->replace($input);
    }

    /**
     * Préparer les données pour validation (hook)
     */
    protected function prepareForValidation(): void
    {
        $this->sanitizeInput();
    }
}

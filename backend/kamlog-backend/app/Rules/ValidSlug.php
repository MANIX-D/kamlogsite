<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidSlug implements ValidationRule
{
    protected int $minLength;
    protected int $maxLength;

    public function __construct(int $minLength = 3, int $maxLength = 255)
    {
        $this->minLength = $minLength;
        $this->maxLength = $maxLength;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('Le slug doit être une chaîne de caractères.');
            return;
        }

        $length = strlen($value);

        // Vérifier la longueur
        if ($length < $this->minLength) {
            $fail("Le slug doit contenir au moins {$this->minLength} caractères.");
            return;
        }

        if ($length > $this->maxLength) {
            $fail("Le slug ne peut pas dépasser {$this->maxLength} caractères.");
            return;
        }

        // Vérifier le format
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/i', $value)) {
            $fail('Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.');
            return;
        }

        // Vérifier qu'il ne commence/finit pas par un tiret
        if (str_starts_with($value, '-') || str_ends_with($value, '-')) {
            $fail('Le slug ne peut pas commencer ou finir par un tiret.');
            return;
        }

        // Vérifier qu'il n'y a pas de double tiret
        if (str_contains($value, '--')) {
            $fail('Le slug ne peut pas contenir de double tiret.');
            return;
        }

        // Bloquer les slugs réservés
        $reserved = ['admin', 'api', 'login', 'logout', 'register', 'password', 'home', 'index'];
        if (in_array(strtolower($value), $reserved)) {
            $fail('Ce slug est réservé et ne peut pas être utilisé.');
            return;
        }
    }
}

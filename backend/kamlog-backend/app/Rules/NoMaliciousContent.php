<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoMaliciousContent implements ValidationRule
{
    protected array $dangerousPatterns = [
        '/<script\b[^>]*>.*?<\/script>/is',
        '/<iframe\b[^>]*>.*?<\/iframe>/is',
        '/javascript:/i',
        '/on\w+\s*=/i', // onclick, onload, etc.
        '/<embed\b/i',
        '/<object\b/i',
        '/data:text\/html/i',
    ];

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            return;
        }

        foreach ($this->dangerousPatterns as $pattern) {
            if (preg_match($pattern, $value)) {
                $fail('Le contenu contient des éléments potentiellement dangereux.');
                return;
            }
        }
    }
}

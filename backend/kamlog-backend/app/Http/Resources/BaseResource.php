<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    /**
     * Wrap the resource in a standard response format
     */
    public function with(Request $request): array
    {
        return [
            'success' => true,
            'message' => $this->getMessage(),
        ];
    }

    /**
     * Get the message for the response
     */
    protected function getMessage(): string
    {
        return 'Données récupérées avec succès';
    }

    /**
     * Format timestamp
     */
    protected function formatDate($date): ?string
    {
        return $date ? $date->format('Y-m-d H:i:s') : null;
    }

    /**
     * Format date only
     */
    protected function formatDateOnly($date): ?string
    {
        return $date ? $date->format('Y-m-d') : null;
    }

    /**
     * Format boolean
     */
    protected function formatBoolean($value): bool
    {
        return (bool) $value;
    }
}

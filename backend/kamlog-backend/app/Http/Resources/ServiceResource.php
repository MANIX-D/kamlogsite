<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ServiceResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'slug' => $this->slug,
            'description' => $this->description,
            'icone' => $this->icone,
            'image_url' => $this->image_url,
            'ordre' => $this->ordre,
            'actif' => $this->formatBoolean($this->actif),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Service récupéré avec succès';
    }
}

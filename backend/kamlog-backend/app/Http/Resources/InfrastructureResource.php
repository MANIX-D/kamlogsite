<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class InfrastructureResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'type' => $this->type,
            'adresse' => $this->adresse,
            'ville' => $this->ville,
            'pays' => $this->pays,
            'superficie' => $this->superficie,
            'capacite' => $this->capacite,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'actif' => $this->formatBoolean($this->actif),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Infrastructure récupérée avec succès';
    }
}

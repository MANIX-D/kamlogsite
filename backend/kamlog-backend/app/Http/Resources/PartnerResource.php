<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class PartnerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'logo_url' => $this->logo_url,
            'site_web' => $this->site_web,
            'description' => $this->description,
            'type' => $this->type,
            'ordre' => $this->ordre,
            'actif' => $this->formatBoolean($this->actif),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Partenaire récupéré avec succès';
    }
}

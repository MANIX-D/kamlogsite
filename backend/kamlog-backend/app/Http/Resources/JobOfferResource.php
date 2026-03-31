<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class JobOfferResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'description' => $this->description,
            'type_contrat' => $this->type_contrat,
            'localisation' => $this->localisation,
            'salaire' => $this->salaire,
            'experience_requise' => $this->experience_requise,
            'niveau_etude' => $this->niveau_etude,
            'competences' => $this->competences,
            'date_limite' => $this->formatDate($this->date_limite),
            'actif' => $this->formatBoolean($this->actif),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Offre d\'emploi récupérée avec succès';
    }
}

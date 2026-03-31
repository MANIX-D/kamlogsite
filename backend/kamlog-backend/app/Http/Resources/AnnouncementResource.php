<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class AnnouncementResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'contenu' => $this->contenu,
            'type' => $this->type,
            'priorite' => $this->priorite,
            'date_debut' => $this->formatDate($this->date_debut),
            'date_fin' => $this->formatDate($this->date_fin),
            'cible' => $this->cible,
            'actif' => $this->formatBoolean($this->actif),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Annonce récupérée avec succès';
    }
}

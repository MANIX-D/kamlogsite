<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ContactMessageResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'sujet' => $this->sujet,
            'message' => $this->message,
            'statut' => $this->statut,
            'reponse' => $this->reponse,
            'date_reponse' => $this->formatDate($this->date_reponse),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Message de contact récupéré avec succès';
    }
}

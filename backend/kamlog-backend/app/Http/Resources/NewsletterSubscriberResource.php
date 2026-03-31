<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class NewsletterSubscriberResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'actif' => $this->formatBoolean($this->actif),
            'date_inscription' => $this->formatDate($this->date_inscription),
            'date_desinscription' => $this->formatDate($this->date_desinscription),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Abonné newsletter récupéré avec succès';
    }
}

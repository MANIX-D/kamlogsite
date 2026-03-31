<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class QuoteRequestResource extends BaseResource
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
            'entreprise' => $this->entreprise,
            'type_service' => $this->type_service,
            'description' => $this->description,
            'budget' => $this->budget,
            'delai' => $this->delai,
            'statut' => $this->statut,
            'montant_devis' => $this->montant_devis,
            'date_envoi_devis' => $this->formatDate($this->date_envoi_devis),
            'notes_admin' => $this->notes_admin,
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Demande de devis récupérée avec succès';
    }
}

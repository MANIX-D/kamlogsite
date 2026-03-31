<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class VisitRequestResource extends BaseResource
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
            'nombre_personnes' => $this->nombre_personnes,
            'date_souhaitee' => $this->formatDate($this->date_souhaitee),
            'message' => $this->message,
            'statut' => $this->statut,
            'date_confirmee' => $this->formatDate($this->date_confirmee),
            'notes_admin' => $this->notes_admin,
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Demande de visite récupérée avec succès';
    }
}

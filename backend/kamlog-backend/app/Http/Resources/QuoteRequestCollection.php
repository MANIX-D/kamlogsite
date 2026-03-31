<?php

namespace App\Http\Resources;

class QuoteRequestCollection extends BaseResourceCollection
{
    public $collects = QuoteRequestResource::class;

    protected function getMessage(): string
    {
        return 'Liste des demandes de devis récupérée avec succès';
    }
}

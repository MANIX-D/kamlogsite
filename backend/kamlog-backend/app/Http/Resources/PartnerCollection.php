<?php

namespace App\Http\Resources;

class PartnerCollection extends BaseResourceCollection
{
    public $collects = PartnerResource::class;

    protected function getMessage(): string
    {
        return 'Liste des partenaires récupérée avec succès';
    }
}

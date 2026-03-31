<?php

namespace App\Http\Resources;

class VisitRequestCollection extends BaseResourceCollection
{
    public $collects = VisitRequestResource::class;

    protected function getMessage(): string
    {
        return 'Liste des demandes de visite récupérée avec succès';
    }
}

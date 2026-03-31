<?php

namespace App\Http\Resources;

class InfrastructureCollection extends BaseResourceCollection
{
    public $collects = InfrastructureResource::class;

    protected function getMessage(): string
    {
        return 'Liste des infrastructures récupérée avec succès';
    }
}

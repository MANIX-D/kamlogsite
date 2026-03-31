<?php

namespace App\Http\Resources;

class ServiceCollection extends BaseResourceCollection
{
    /**
     * The resource that this resource collects.
     */
    public $collects = ServiceResource::class;

    protected function getMessage(): string
    {
        return 'Liste des services récupérée avec succès';
    }
}

<?php

namespace App\Http\Resources;

class JobOfferCollection extends BaseResourceCollection
{
    public $collects = JobOfferResource::class;

    protected function getMessage(): string
    {
        return 'Liste des offres d\'emploi récupérée avec succès';
    }
}

<?php

namespace App\Http\Resources;

class NewsCollection extends BaseResourceCollection
{
    public $collects = NewsResource::class;

    protected function getMessage(): string
    {
        return 'Liste des actualités récupérée avec succès';
    }
}

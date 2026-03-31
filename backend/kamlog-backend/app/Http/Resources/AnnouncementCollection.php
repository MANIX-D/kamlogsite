<?php

namespace App\Http\Resources;

class AnnouncementCollection extends BaseResourceCollection
{
    public $collects = AnnouncementResource::class;

    protected function getMessage(): string
    {
        return 'Liste des annonces récupérée avec succès';
    }
}

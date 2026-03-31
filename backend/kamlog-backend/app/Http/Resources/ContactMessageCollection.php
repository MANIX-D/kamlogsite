<?php

namespace App\Http\Resources;

class ContactMessageCollection extends BaseResourceCollection
{
    public $collects = ContactMessageResource::class;

    protected function getMessage(): string
    {
        return 'Liste des messages de contact récupérée avec succès';
    }
}

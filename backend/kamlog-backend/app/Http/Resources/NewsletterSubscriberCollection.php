<?php

namespace App\Http\Resources;

class NewsletterSubscriberCollection extends BaseResourceCollection
{
    public $collects = NewsletterSubscriberResource::class;

    protected function getMessage(): string
    {
        return 'Liste des abonnés newsletter récupérée avec succès';
    }
}

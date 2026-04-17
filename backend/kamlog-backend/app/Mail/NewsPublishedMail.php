<?php

namespace App\Mail;

use App\Models\News;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsPublishedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $unsubscribeLink;
    public string $newsLink;

    public function __construct(
        public readonly News $news,
        public readonly NewsletterSubscriber $subscriber,
    ) {
        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
        $this->newsLink = "{$frontendUrl}/actualites/{$news->slug_fr}";
        $this->unsubscribeLink = rtrim(config('app.url'), '/') . "/api/newsletter/unsubscribe/{$subscriber->token_desinscription}";
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'KAMLOG — Nouvelle actualité : ' . $this->news->titre_fr,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.news-published',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

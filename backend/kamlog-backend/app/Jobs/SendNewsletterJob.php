<?php

namespace App\Jobs;

use App\Mail\NewsPublishedMail;
use App\Models\News;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendNewsletterJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Nombre de tentatives max
     */
    public int $tries = 3;

    /**
     * Délai entre les tentatives (secondes)
     */
    public int $backoff = 60;

    public function __construct(
        public readonly News $news,
    ) {}

    public function handle(): void
    {
        $subscribers = NewsletterSubscriber::active()->get();

        if ($subscribers->isEmpty()) {
            Log::info('SendNewsletterJob: Aucun abonné actif, aucun email envoyé.', [
                'news_id' => $this->news->id,
            ]);
            return;
        }

        $sent = 0;
        $failed = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(
                    new NewsPublishedMail($this->news, $subscriber)
                );
                $sent++;
            } catch (\Throwable $e) {
                $failed++;
                Log::error('SendNewsletterJob: Échec envoi email', [
                    'news_id' => $this->news->id,
                    'subscriber_email' => $subscriber->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('SendNewsletterJob: Envoi terminé', [
            'news_id' => $this->news->id,
            'titre' => $this->news->titre_fr,
            'sent' => $sent,
            'failed' => $failed,
            'total_subscribers' => $subscribers->count(),
        ]);
    }
}

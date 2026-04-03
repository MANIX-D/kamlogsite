<?php

namespace App\Mail;

use App\Models\PasswordResetToken;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetLink;
    public string $code;
    public string $email;

    public function __construct(
        public PasswordResetToken $resetToken,
        string $plainToken,
    ) {
        $this->email = $resetToken->email;
        $this->code = $resetToken->code;
        $this->resetLink = config('app.frontend_url') . '/admin/verify-code/' . $plainToken;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Réinitialisation de votre mot de passe — KAMLOG',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset',
        );
    }
}

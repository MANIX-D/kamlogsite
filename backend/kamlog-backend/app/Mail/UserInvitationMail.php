<?php

namespace App\Mail;

use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $invitationLink;

    public function __construct(
        public readonly UserInvitation $invitation,
        public readonly string $rawToken,
        public readonly User $inviter,
    ) {
        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
        $this->invitationLink = "{$frontendUrl}/admin/register/{$rawToken}";
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invitation à rejoindre KAMLOG Admin — ' . ucfirst($this->invitation->role),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.invitation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

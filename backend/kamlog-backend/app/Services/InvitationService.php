<?php

namespace App\Services;

use App\Mail\UserInvitationMail;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InvitationService
{
    public const EXPIRY_HOURS = 24;

    /**
     * Créer une nouvelle invitation et envoyer l'email.
     * Seul le super_admin est autorisé à inviter (vérifié côté controller).
     *
     * @param User   $inviter Utilisateur qui crée l'invitation (super_admin)
     * @param string $email   Email du destinataire
     * @param string $role    Rôle à attribuer (admin uniquement)
     */
    public function createInvitation(
        User $inviter,
        string $email,
        string $role,
    ): UserInvitation {
        // Vérification de hiérarchie : seul le super_admin peut inviter
        if (!$inviter->isSuperAdmin()) {
            throw new \InvalidArgumentException('Seul le super administrateur peut envoyer des invitations.');
        }

        // Seul le rôle 'admin' peut être invité
        if (!in_array($role, ['admin'], true)) {
            throw new \InvalidArgumentException('Rôle invalide. Seul le rôle "admin" peut être attribué par invitation.');
        }

        // Invalider les invitations en attente pour ce même email
        UserInvitation::where('email', $email)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->update(['expires_at' => now()]);

        // Générer un token sécurisé
        $rawToken    = $this->generateSecureToken();
        $hashedToken = hash('sha256', $rawToken);

        $invitation = UserInvitation::create([
            'email'      => strtolower(trim($email)),
            'role'       => $role,
            'token'      => $hashedToken,
            'invited_by' => $inviter->id,
            'expires_at' => now()->addHours(self::EXPIRY_HOURS),
        ]);

        // Envoyer l'email avec le token brut (pas le hash)
        Mail::to($email)->send(new UserInvitationMail($invitation, $rawToken, $inviter));

        return $invitation;
    }

    /**
     * Valider un token d'invitation (sans l'accepter).
     * Utilisé par le frontend pour pré-remplir le formulaire d'inscription.
     *
     * @throws \InvalidArgumentException si le token est invalide ou expiré
     */
    public function validateToken(string $rawToken): UserInvitation
    {
        $hashedToken = hash('sha256', $rawToken);

        $invitation = UserInvitation::where('token', $hashedToken)->first();

        if (!$invitation) {
            throw new \InvalidArgumentException('Lien d\'invitation invalide.');
        }

        if ($invitation->isAccepted()) {
            throw new \InvalidArgumentException('Ce lien d\'invitation a déjà été utilisé.');
        }

        if ($invitation->isExpired()) {
            throw new \InvalidArgumentException('Ce lien d\'invitation a expiré. Veuillez demander une nouvelle invitation.');
        }

        return $invitation;
    }

    /**
     * Accepter une invitation et créer le compte utilisateur.
     *
     * @param string $rawToken  Token brut reçu dans l'URL
     * @param string $name      Nom complet de l'utilisateur
     * @param string $password  Mot de passe choisi
     */
    public function acceptInvitation(string $rawToken, string $name, string $password): User
    {
        $invitation = $this->validateToken($rawToken);

        // Créer le compte utilisateur
        $user = User::create([
            'name'              => trim($name),
            'email'             => $invitation->email,
            'password'          => Hash::make($password),
            'role'              => $invitation->role,
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        // Marquer l'invitation comme acceptée
        $invitation->update([
            'accepted_at' => now(),
            'accepted_by' => $user->id,
        ]);

        return $user;
    }

    /**
     * Révoquer une invitation en attente.
     */
    public function revokeInvitation(UserInvitation $invitation): void
    {
        if ($invitation->isAccepted()) {
            throw new \InvalidArgumentException('Impossible de révoquer une invitation déjà acceptée.');
        }

        $invitation->update(['expires_at' => now()]);
    }

    /**
     * Générer un token sécurisé unique.
     */
    private function generateSecureToken(): string
    {
        return Str::random(64);
    }
}

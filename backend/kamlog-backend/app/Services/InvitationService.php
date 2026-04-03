<?php

namespace App\Services;

use App\Mail\UserInvitationMail;
use App\Models\User;
use App\Models\UserInvitation;
use App\Models\UserPermission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InvitationService
{
    public const EXPIRY_HOURS = 24;

    /**
     * Créer une nouvelle invitation et envoyer l'email.
     *
     * @param User   $inviter     Utilisateur qui crée l'invitation
     * @param string $email       Email du destinataire
     * @param string $role        Rôle à attribuer (super_admin|admin|editor)
     * @param array  $permissions Permissions granulaires (pour les éditeurs uniquement)
     *                            Format: [ 'actualites' => ['read'=>true,'write'=>true,'delete'=>false], ... ]
     */
    public function createInvitation(
        User $inviter,
        string $email,
        string $role,
        array $permissions = []
    ): UserInvitation {
        // Vérification de hiérarchie (empêche un admin de créer un super_admin ou admin)
        if ($inviter->isAdmin() && !$inviter->isSuperAdmin()) {
            if ($role !== 'editor') {
                throw new \InvalidArgumentException('Un administrateur ne peut inviter que des éditeurs.');
            }
        }

        // Invalider les invitations en attente pour ce même email
        UserInvitation::where('email', $email)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->update(['expires_at' => now()]);

        // Générer un token sécurisé
        $rawToken = $this->generateSecureToken();
        $hashedToken = hash('sha256', $rawToken);

        $invitation = UserInvitation::create([
            'email'      => strtolower(trim($email)),
            'role'       => $role,
            'permissions' => $role === 'editor' ? $permissions : null,
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

        // Créer les permissions granulaires si éditeur
        if ($invitation->role === 'editor' && !empty($invitation->permissions)) {
            foreach ($invitation->permissions as $section => $perms) {
                if (!in_array($section, UserPermission::SECTIONS, true)) {
                    continue;
                }

                UserPermission::create([
                    'user_id'    => $user->id,
                    'section'    => $section,
                    'can_read'   => (bool) ($perms['read'] ?? true),
                    'can_write'  => (bool) ($perms['write'] ?? false),
                    'can_delete' => (bool) ($perms['delete'] ?? false),
                ]);
            }
        }

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

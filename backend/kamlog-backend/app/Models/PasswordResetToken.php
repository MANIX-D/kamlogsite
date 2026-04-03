<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    protected $fillable = [
        'email',
        'token_hash',
        'code',
        'expires_at',
        'used_at',
        'verified_at',
    ];

    protected $casts = [
        'expires_at'  => 'datetime',
        'used_at'     => 'datetime',
        'verified_at' => 'datetime',
    ];

    /**
     * Vérifie si le token est expiré.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Vérifie si le token a déjà été utilisé (mot de passe changé).
     */
    public function isUsed(): bool
    {
        return $this->used_at !== null;
    }

    /**
     * Vérifie si le code a été vérifié.
     */
    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    /**
     * Vérifie si le token est valide pour utilisation.
     */
    public function isValid(): bool
    {
        return !$this->isExpired() && !$this->isUsed();
    }

    /**
     * Marquer comme vérifié (code correct).
     */
    public function markAsVerified(): void
    {
        $this->update(['verified_at' => now()]);
    }

    /**
     * Marquer comme utilisé (mot de passe changé).
     */
    public function markAsUsed(): void
    {
        $this->update(['used_at' => now()]);
    }
}

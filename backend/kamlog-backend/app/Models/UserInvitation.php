<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInvitation extends Model
{
    protected $fillable = [
        'email',
        'role',
        'permissions',
        'token',
        'invited_by',
        'accepted_at',
        'accepted_by',
        'expires_at',
    ];

    protected $casts = [
        'permissions' => 'array',
        'accepted_at' => 'datetime',
        'expires_at'  => 'datetime',
    ];

    protected $hidden = [
        'token', // Ne jamais exposer le token en réponse JSON
    ];

    // ─── Relations ───────────────────────────────────────────────

    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function acceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by');
    }

    // ─── État ────────────────────────────────────────────────────

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isAccepted(): bool
    {
        return $this->accepted_at !== null;
    }

    public function isPending(): bool
    {
        return !$this->isAccepted() && !$this->isExpired();
    }

    public function getStatusAttribute(): string
    {
        if ($this->isAccepted()) return 'accepted';
        if ($this->isExpired()) return 'expired';
        return 'pending';
    }
}

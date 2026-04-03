<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'phone',
        'is_active',
        'last_login_at',
        'last_login_ip',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Relation: Permissions granulaires (pour les éditeurs)
     */
    public function permissions(): HasMany
    {
        return $this->hasMany(UserPermission::class);
    }

    /**
     * Relation: Invitations émises par cet utilisateur
     */
    public function sentInvitations(): HasMany
    {
        return $this->hasMany(UserInvitation::class, 'invited_by');
    }

    /**
     * Relation: Un admin peut avoir traité plusieurs messages de contact
     */
    public function contactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class);
    }

    /**
     * Relation: Un admin peut avoir traité plusieurs demandes de visite
     */
    public function visitRequests(): HasMany
    {
        return $this->hasMany(VisitRequest::class);
    }

    /**
     * Relation: Un admin peut avoir traité plusieurs candidatures
     */
    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Relation: Un admin peut avoir traité plusieurs demandes de devis
     */
    public function quoteRequests(): HasMany
    {
        return $this->hasMany(QuoteRequest::class);
    }

    /**
     * Vérifier si l'utilisateur est super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /**
     * Vérifier si l'utilisateur est admin (super_admin ou admin)
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin'], true);
    }

    /**
     * Vérifier si l'utilisateur est éditeur
     */
    public function isEditor(): bool
    {
        return $this->role === 'editor';
    }

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Vérifier si l'utilisateur a l'un des rôles
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    /**
     * Vérifier si l'utilisateur a accès à une section donnée.
     * - super_admin et admin : accès complet implicite
     * - editor : vérification dans user_permissions
     *
     * @param string $section  Section concernée (ex: 'actualites')
     * @param string $action   'read' | 'write' | 'delete'
     */
    public function hasPermission(string $section, string $action = 'read'): bool
    {
        if ($this->isAdmin()) {
            return true; // super_admin et admin ont tout
        }

        if (!$this->isEditor()) {
            return false;
        }

        $column = match ($action) {
            'write'  => 'can_write',
            'delete' => 'can_delete',
            default  => 'can_read',
        };

        $permission = $this->permissions()
            ->where('section', $section)
            ->first();

        return $permission?->$column === true;
    }

    /**
     * Retourner toutes les permissions formatées pour les réponses API
     */
    public function getFormattedPermissions(): array
    {
        if ($this->isAdmin()) {
            // Admin et super_admin ont accès à tout
            return array_fill_keys(UserPermission::SECTIONS, [
                'read' => true, 'write' => true, 'delete' => true,
            ]);
        }

        if (!$this->isEditor()) {
            return [];
        }

        $perms = [];
        foreach ($this->permissions as $perm) {
            $perms[$perm->section] = [
                'read'   => $perm->can_read,
                'write'  => $perm->can_write,
                'delete' => $perm->can_delete,
            ];
        }
        return $perms;
    }

    /**
     * Scope pour filtrer par rôle
     */
    public function scopeOfRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope pour les utilisateurs actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour récupérer les super admins
     */
    public function scopeSuperAdmins($query)
    {
        return $query->where('role', 'super_admin');
    }

    /**
     * Mettre à jour les informations de dernière connexion
     */
    public function updateLastLogin($ipAddress = null)
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ipAddress ?? request()->ip(),
        ]);
    }
}

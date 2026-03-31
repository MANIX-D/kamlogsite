<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactMessage extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Relations à charger par défaut
     */
    protected $with = [];

    /**
     * Nombre d'éléments par page pour la pagination
     */
    protected $perPage = 20;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'entreprise',
        'sujet',
        'message',
        'statut',
        'lu',
        'reponse',
        'date_reponse',
        'user_id',
        'ip_address',
    ];

    protected $casts = [
        'lu' => 'boolean',
        'date_reponse' => 'datetime',
    ];

    protected $attributes = [
        'statut' => 'nouveau',
        'lu' => false,
    ];

    /**
     * Relation: Un message appartient à un administrateur (qui l'a traité)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope pour récupérer les messages non lus
     */
    public function scopeUnread($query)
    {
        return $query->where('lu', false);
    }

    /**
     * Scope pour récupérer les messages lus
     */
    public function scopeRead($query)
    {
        return $query->where('lu', true);
    }

    /**
     * Scope pour filtrer par statut
     */
    public function scopeOfStatus($query, $status)
    {
        return $query->where('statut', $status);
    }

    /**
     * Scope pour récupérer les nouveaux messages
     */
    public function scopeNew($query)
    {
        return $query->where('statut', 'nouveau');
    }

    /**
     * Marquer comme lu
     */
    public function markAsRead()
    {
        $this->update(['lu' => true]);
    }

    /**
     * Marquer comme non lu
     */
    public function markAsUnread()
    {
        $this->update(['lu' => false]);
    }
}

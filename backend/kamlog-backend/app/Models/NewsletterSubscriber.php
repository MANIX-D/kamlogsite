<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Nombre d'éléments par page pour la pagination
     */
    protected $perPage = 50;

    protected $fillable = [
        'email',
        'nom',
        'prenom',
        'entreprise',
        'statut',
        'token_desinscription',
        'date_inscription',
        'date_desinscription',
        'ip_address',
    ];

    protected $casts = [
        'date_inscription' => 'datetime',
        'date_desinscription' => 'datetime',
    ];

    protected $attributes = [
        'statut' => 'actif',
    ];

    /**
     * Boot du modèle
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($subscriber) {
            if (empty($subscriber->token_desinscription)) {
                $subscriber->token_desinscription = Str::random(64);
            }
            if (empty($subscriber->date_inscription)) {
                $subscriber->date_inscription = now();
            }
        });
    }

    /**
     * Scope pour filtrer par statut
     */
    public function scopeOfStatus($query, $status)
    {
        return $query->where('statut', $status);
    }

    /**
     * Scope pour récupérer les abonnés actifs
     */
    public function scopeActive($query)
    {
        return $query->where('statut', 'actif');
    }

    /**
     * Scope pour récupérer les désinscrits
     */
    public function scopeUnsubscribed($query)
    {
        return $query->where('statut', 'desinscrit');
    }

    /**
     * Désinscrire un abonné
     */
    public function unsubscribe()
    {
        $this->update([
            'statut' => 'desinscrit',
            'date_desinscription' => now(),
        ]);
    }

    /**
     * Réinscrire un abonné
     */
    public function resubscribe()
    {
        $this->update([
            'statut' => 'actif',
            'date_desinscription' => null,
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobApplication extends Model
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
        'job_offer_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'birth_date',
        'linkedin_url',
        'portfolio_url',
        'cover_letter',
        'cv_path',
        'status',
        'notes_admin',
        'application_date',
        'user_id',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'application_date' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'en_attente',
    ];

    /**
     * Boot du modèle
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($application) {
            if (empty($application->application_date)) {
                $application->application_date = now();
            }
        });

        static::created(function ($application) {
            // Incrémenter le compteur de candidatures de l'offre
            if ($application->job_offer_id) {
                JobOffer::where('id', $application->job_offer_id)->increment('applications_count');
            }
        });

        static::deleted(function ($application) {
            // Décrémenter le compteur de candidatures de l'offre
            if ($application->job_offer_id) {
                JobOffer::where('id', $application->job_offer_id)->decrement('applications_count');
            }
        });
    }

    /**
     * Relation: Une candidature appartient à une offre d'emploi
     */
    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class);
    }

    /**
     * Relation: Une candidature appartient à un administrateur (qui l'a traitée)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope pour filtrer par statut
     */
    public function scopeOfStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope pour récupérer les candidatures en attente
     */
    public function scopePending($query)
    {
        return $query->where('status', 'en_attente');
    }

    /**
     * Scope pour récupérer les candidatures en cours
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', 'en_cours');
    }

    /**
     * Scope pour récupérer les candidatures acceptées
     */
    public function scopeAccepted($query)
    {
        return $query->where('status', 'acceptee');
    }

    /**
     * Scope pour récupérer les candidatures refusées
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'refusee');
    }

    /**
     * Obtenir le nom complet
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}

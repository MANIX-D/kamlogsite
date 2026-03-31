<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobOffer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Relations à charger par défaut
     */
    protected $with = [];

    /**
     * Nombre d'éléments par page pour la pagination
     */
    protected $perPage = 15;

    protected $fillable = [
        'title_fr',
        'title_en',
        'description_fr',
        'description_en',
        'requirements_fr',
        'requirements_en',
        'benefits_fr',
        'benefits_en',
        'contract_type',
        'location',
        'experience_level',
        'salary_range',
        'department',
        'application_deadline',
        'is_active',
        'is_urgent',
        'applications_count',
    ];

    protected $casts = [
        'application_deadline' => 'date',
        'is_active' => 'boolean',
        'is_urgent' => 'boolean',
        'applications_count' => 'integer',
    ];

    protected $attributes = [
        'is_active' => true,
        'is_urgent' => false,
        'applications_count' => 0,
    ];

    /**
     * Relation: Une offre d'emploi a plusieurs candidatures
     */
    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Scope pour récupérer les offres actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour récupérer les offres urgentes
     */
    public function scopeUrgent($query)
    {
        return $query->where('is_urgent', true);
    }

    /**
     * Scope pour récupérer les offres non expirées
     */
    public function scopeNotExpired($query)
    {
        return $query->where('application_deadline', '>=', now()->toDateString());
    }

    /**
     * Scope pour filtrer par type de contrat
     */
    public function scopeOfContractType($query, $type)
    {
        return $query->where('contract_type', $type);
    }

    /**
     * Scope pour filtrer par niveau d'expérience
     */
    public function scopeOfExperienceLevel($query, $level)
    {
        return $query->where('experience_level', $level);
    }

    /**
     * Scope pour filtrer par localisation
     */
    public function scopeAtLocation($query, $location)
    {
        return $query->where('location', $location);
    }

    /**
     * Incrémenter le compteur de candidatures
     */
    public function incrementApplicationsCount()
    {
        $this->increment('applications_count');
    }

    /**
     * Décrémenter le compteur de candidatures
     */
    public function decrementApplicationsCount()
    {
        $this->decrement('applications_count');
    }
}

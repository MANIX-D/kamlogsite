<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuoteRequest extends Model
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
        'company_name',
        'contact_person',
        'email',
        'phone',
        'address',
        'service_type',
        'project_description',
        'requirements',
        'budget_range',
        'desired_start_date',
        'desired_end_date',
        'priority',
        'status',
        'estimated_amount',
        'notes_admin',
        'quote_document_path',
        'ip_address',
        'user_id',
    ];

    protected $casts = [
        'requirements' => 'array',
        'desired_start_date' => 'date',
        'desired_end_date' => 'date',
        'estimated_amount' => 'decimal:2',
    ];

    protected $attributes = [
        'priority' => 'normale',
        'status' => 'nouveau',
    ];

    /**
     * Relation: Une demande de devis appartient à un administrateur (qui l'a traitée)
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
     * Scope pour récupérer les nouvelles demandes
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'nouveau');
    }

    /**
     * Scope pour récupérer les demandes en cours
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', 'en_cours');
    }

    /**
     * Scope pour filtrer par priorité
     */
    public function scopeOfPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope pour filtrer par type de service
     */
    public function scopeOfServiceType($query, $type)
    {
        return $query->where('service_type', $type);
    }

    /**
     * Scope pour trier par priorité (urgente en premier)
     */
    public function scopeOrderedByPriority($query)
    {
        return $query->orderByRaw("CASE priority WHEN 'urgente' THEN 1 WHEN 'haute' THEN 2 WHEN 'normale' THEN 3 WHEN 'basse' THEN 4 ELSE 5 END");
    }
}

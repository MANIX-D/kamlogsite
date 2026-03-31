<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Infrastructure extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Nombre d'éléments par page pour la pagination
     */
    protected $perPage = 15;

    protected $fillable = [
        'nom_fr',
        'nom_en',
        'description_fr',
        'description_en',
        'surface',
        'capacite',
        'image',
        'image_alt_fr',
        'image_alt_en',
        'type',
        'equipements',
        'specifications_techniques',
        'display_order',
        'is_active',
        'is_available',
    ];

    protected $casts = [
        'equipements' => 'array',
        'specifications_techniques' => 'array',
        'is_active' => 'boolean',
        'is_available' => 'boolean',
        'display_order' => 'integer',
    ];

    protected $attributes = [
        'is_active' => true,
        'is_available' => true,
        'display_order' => 0,
        'type' => 'entrepot',
    ];

    /**
     * Relation: Une infrastructure peut avoir plusieurs demandes de visite
     */
    public function visitRequests()
    {
        return $this->hasMany(VisitRequest::class);
    }

    /**
     * Scope pour récupérer uniquement les infrastructures actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour récupérer les infrastructures disponibles
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope pour filtrer par type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour trier par ordre d'affichage
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
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
        'icon',
        'image',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    protected $attributes = [
        'is_active' => true,
        'display_order' => 0,
    ];

    /**
     * Scope pour récupérer uniquement les services actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour trier par ordre d'affichage
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Partner extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Nombre d'éléments par page pour la pagination
     */
    protected $perPage = 20;

    protected $fillable = [
        'name_fr',
        'name_en',
        'logo_url',
        'description_fr',
        'description_en',
        'category',
        'sector_fr',
        'sector_en',
        'website',
        'email',
        'phone',
        'address',
        'partnership_level',
        'display_order',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'display_order' => 'integer',
    ];

    protected $attributes = [
        'is_active' => true,
        'is_featured' => false,
        'display_order' => 0,
        'partnership_level' => 'standard',
    ];

    /**
     * Scope pour récupérer uniquement les partenaires actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour récupérer les partenaires en vedette
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope pour filtrer par catégorie
     */
    public function scopeOfCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope pour filtrer par niveau de partenariat
     */
    public function scopeOfLevel($query, $level)
    {
        return $query->where('partnership_level', $level);
    }

    /**
     * Scope pour trier par ordre d'affichage
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }

    /**
     * Get the full URL for the logo
     */
    public function getLogoUrlAttribute($value): ?string
    {
        if (!$value) {
            return null;
        }

        // If logo already contains full URL, return as is
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // Return storage URL
        return asset('storage/' . $value);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Nombre d'éléments par page pour la pagination
     */
    protected $perPage = 10;

    protected $fillable = [
        'title_fr',
        'title_en',
        'content_fr',
        'content_en',
        'priority',
        'type',
        'is_active',
        'is_popup',
        'start_date',
        'end_date',
        'background_color',
        'text_color',
        'icon',
        'button_text_fr',
        'button_text_en',
        'button_url',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_popup' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $attributes = [
        'is_active' => true,
        'is_popup' => false,
        'priority' => 'normal',
        'type' => 'info',
    ];

    /**
     * Scope pour récupérer les annonces actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour récupérer les annonces en cours (dans la période de validité)
     */
    public function scopeCurrent($query)
    {
        $today = now()->toDateString();
        return $query->where(function ($q) use ($today) {
                         $q->whereNull('start_date')
                           ->orWhere('start_date', '<=', $today);
                     })
                     ->where(function ($q) use ($today) {
                         $q->whereNull('end_date')
                           ->orWhere('end_date', '>=', $today);
                     });
    }

    /**
     * Scope pour récupérer les annonces popup
     */
    public function scopePopup($query)
    {
        return $query->where('is_popup', true);
    }

    /**
     * Scope pour filtrer par priorité
     */
    public function scopeOfPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope pour filtrer par type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour trier par priorité (urgent en premier)
     */
    public function scopeOrderedByPriority($query)
    {
        return $query->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 WHEN 'low' THEN 4 ELSE 5 END");
    }
}

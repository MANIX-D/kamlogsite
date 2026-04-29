<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVisit extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'page',
        'ip_address',
        'user_agent',
        'referrer',
        'country',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];

    /**
     * Scope: visites d'aujourd'hui
     */
    public function scopeToday($query)
    {
        return $query->whereDate('visited_at', now()->toDateString());
    }

    /**
     * Scope: visites de cette semaine
     */
    public function scopeThisWeek($query)
    {
        return $query->where('visited_at', '>=', now()->startOfWeek());
    }

    /**
     * Scope: visites de ce mois
     */
    public function scopeThisMonth($query)
    {
        return $query->where('visited_at', '>=', now()->startOfMonth());
    }
}

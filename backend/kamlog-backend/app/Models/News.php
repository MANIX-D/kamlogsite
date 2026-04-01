<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'news';

    /**
     * Nombre d'éléments par page pour la pagination
     */
    protected $perPage = 12;

    protected $fillable = [
        'titre_fr',
        'titre_en',
        'contenu_fr',
        'contenu_en',
        'slug_fr',
        'slug_en',
        'type',
        'image',
        'image_alt_fr',
        'image_alt_en',
        'date_publication',
        'is_published',
        'is_featured',
        'views',
    ];

    protected $casts = [
        'date_publication' => 'date',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'views' => 'integer',
    ];

    protected $attributes = [
        'is_published' => false,
        'is_featured' => false,
        'views' => 0,
        'type' => 'article',
    ];

    /**
     * Scope pour récupérer uniquement les actualités publiées
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope pour récupérer les actualités en vedette
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope pour filtrer par type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour trier par date de publication
     */
    public function scopeLatestPublished($query)
    {
        return $query->orderBy('date_publication', 'desc');
    }

    /**
     * Incrémenter le compteur de vues (debounced via cache to reduce DB writes)
     */
    public function incrementViews()
    {
        $cacheKey = 'news:views:' . $this->id;

        if (!\Illuminate\Support\Facades\Cache::has($cacheKey)) {
            \Illuminate\Support\Facades\Cache::put($cacheKey, 0, now()->addHours(2));
        }

        $pending = \Illuminate\Support\Facades\Cache::increment($cacheKey);

        // Flush to DB every 10 views or if no cache driver (testing)
        if ($pending >= 10 || config('cache.default') === 'array') {
            $this->increment('views', $pending);
            \Illuminate\Support\Facades\Cache::forget($cacheKey);
        }
    }
}

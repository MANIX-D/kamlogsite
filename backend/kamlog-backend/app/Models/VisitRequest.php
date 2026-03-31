<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitRequest extends Model
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
        'name',
        'email',
        'phone',
        'company',
        'date',
        'heure',
        'type_visite',
        'message',
        'status',
        'notes_admin',
        'ip_address',
        'infrastructure_id',
        'user_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    protected $attributes = [
        'status' => 'pending',
        'type_visite' => 'guidee',
    ];

    /**
     * Relation: Une demande de visite appartient à une infrastructure
     */
    public function infrastructure()
    {
        return $this->belongsTo(Infrastructure::class);
    }

    /**
     * Relation: Une demande de visite appartient à un administrateur (qui l'a traitée)
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
     * Scope pour filtrer par type de visite
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type_visite', $type);
    }

    /**
     * Scope pour récupérer les demandes en attente
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope pour récupérer les demandes confirmées
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    /**
     * Scope pour filtrer par date
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    /**
     * Confirmer la demande
     */
    public function confirm()
    {
        $this->update(['status' => 'confirmed']);
    }

    /**
     * Annuler la demande
     */
    public function cancel()
    {
        $this->update(['status' => 'cancelled']);
    }

    /**
     * Marquer comme complétée
     */
    public function complete()
    {
        $this->update(['status' => 'completed']);
    }
}

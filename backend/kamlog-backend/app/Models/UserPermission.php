<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPermission extends Model
{
    public const SECTIONS = [
        'actualites',
        'announcements',
        'job_offers',
        'quotes',
        'messages',
        'newsletter',
        'visit_requests',
        'services',
        'partners',
        'infrastructures',
    ];

    protected $fillable = [
        'user_id',
        'section',
        'can_read',
        'can_write',
        'can_delete',
    ];

    protected $casts = [
        'can_read'   => 'boolean',
        'can_write'  => 'boolean',
        'can_delete' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

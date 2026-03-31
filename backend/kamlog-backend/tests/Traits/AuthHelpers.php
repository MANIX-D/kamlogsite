<?php

namespace Tests\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

trait AuthHelpers
{
    /**
     * Créer un super admin et l'authentifier via Sanctum
     */
    protected function actingAsSuperAdmin(): User
    {
        $user = User::factory()->create([
            'name' => 'Super Admin Test',
            'email' => 'superadmin-' . uniqid() . '@kamlog-test.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user, ['admin:*', 'users:*', 'content:*', 'settings:*']);

        return $user;
    }

    /**
     * Créer un admin et l'authentifier via Sanctum
     */
    protected function actingAsAdmin(): User
    {
        $user = User::factory()->create([
            'name' => 'Admin Test',
            'email' => 'admin-' . uniqid() . '@kamlog-test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user, ['admin:read', 'admin:update', 'users:*', 'content:*']);

        return $user;
    }

    /**
     * Créer un éditeur et l'authentifier via Sanctum
     */
    protected function actingAsEditor(): User
    {
        $user = User::factory()->create([
            'name' => 'Editor Test',
            'email' => 'editor-' . uniqid() . '@kamlog-test.com',
            'password' => Hash::make('password123'),
            'role' => 'editor',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user, ['admin:read', 'content:*']);

        return $user;
    }

    /**
     * Créer un admin non authentifié (pour tests login)
     */
    protected function createAdminUser(array $overrides = []): User
    {
        return User::factory()->create(array_merge([
            'name' => 'Admin User',
            'email' => 'admin-login-' . uniqid() . '@kamlog-test.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'is_active' => true,
        ], $overrides));
    }
}

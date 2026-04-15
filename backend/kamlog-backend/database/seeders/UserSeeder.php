<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seuls deux rôles : super_admin et admin.
     */
    public function run(): void
    {
        // ─── Super Admin ────────────────────────────────────────────────
        User::create([
            'name'              => 'Super Admin KAMLOG',
            'email'             => 'superadmin@kamlog.cm',
            'password'          => bcrypt('K@ml0g$uper2026!'),
            'role'              => 'super_admin',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        // ─── Administrateurs ─────────────────────────────────────────────
        User::create([
            'name'              => 'Admin Principal',
            'email'             => 'admin@kamlog.cm',
            'password'          => bcrypt('K@ml0gAdm1n2026!'),
            'role'              => 'admin',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'              => 'Jean Mbarga',
            'email'             => 'jean.mbarga@kamlog.cm',
            'password'          => bcrypt('J3@nMb@rg2026!'),
            'role'              => 'admin',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        // ─── Admin désactivé (pour tester) ───────────────────────────────
        User::create([
            'name'              => 'Admin Désactivé',
            'email'             => 'admin.disabled@kamlog.cm',
            'password'          => bcrypt('D1s@bled2026!'),
            'role'              => 'admin',
            'is_active'         => false,
            'email_verified_at' => now(),
        ]);
    }
}

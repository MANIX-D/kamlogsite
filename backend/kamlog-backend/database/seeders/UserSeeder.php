<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@kamlog.cm',
            'password' => bcrypt('SuperAdmin123!'),
            'role' => 'super_admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Admin
        User::create([
            'name' => 'Admin KAMLOG',
            'email' => 'admin@kamlog.cm',
            'password' => bcrypt('Admin123!'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Editor
        User::create([
            'name' => 'Éditeur KAMLOG',
            'email' => 'editor@kamlog.cm',
            'password' => bcrypt('Editor123!'),
            'role' => 'editor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Admin désactivé (pour tester)
        User::create([
            'name' => 'Admin Désactivé',
            'email' => 'admin.disabled@kamlog.cm',
            'password' => bcrypt('Admin123!'),
            'role' => 'admin',
            'is_active' => false,
            'email_verified_at' => now(),
        ]);

        // Autres admins
        User::create([
            'name' => 'Jean Mbarga',
            'email' => 'jean.mbarga@kamlog.cm',
            'password' => bcrypt('Password123!'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Marie Kouam',
            'email' => 'marie.kouam@kamlog.cm',
            'password' => bcrypt('Password123!'),
            'role' => 'editor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Éditeurs
        User::create([
            'name' => 'Paul Nkolo',
            'email' => 'paul.nkolo@kamlog.cm',
            'password' => bcrypt('Password123!'),
            'role' => 'editor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Sophie Ateba',
            'email' => 'sophie.ateba@kamlog.cm',
            'password' => bcrypt('Password123!'),
            'role' => 'editor',
            'is_active' => false,
            'email_verified_at' => now(),
        ]);
    }
}

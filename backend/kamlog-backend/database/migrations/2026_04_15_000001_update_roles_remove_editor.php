<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Supprimer le rôle 'editor' et mettre à jour les ENUMs.
     * Les utilisateurs avec role='editor' seront mis à 'admin' (sécurité minimale).
     */
    public function up(): void
    {
        // 1. Mettre à jour les utilisateurs editor existants → admin
        DB::table('users')->where('role', 'editor')->update(['role' => 'admin']);

        // 2. Mettre à jour les invitations editor existantes → admin
        DB::table('user_invitations')->where('role', 'editor')->update(['role' => 'admin']);

        // 3. Modifier l'ENUM de la table users
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin'");

        // 4. Modifier l'ENUM de la table user_invitations
        DB::statement("ALTER TABLE user_invitations MODIFY COLUMN role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin'");

        // 5. Supprimer la colonne permissions des invitations (plus nécessaire sans editor)
        Schema::table('user_invitations', function (Blueprint $table) {
            $table->dropColumn('permissions');
        });
    }

    public function down(): void
    {
        // Restaurer la colonne permissions
        Schema::table('user_invitations', function (Blueprint $table) {
            $table->json('permissions')->nullable()->after('role');
        });

        // Restaurer les ENUMs
        DB::statement("ALTER TABLE user_invitations MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'editor'");
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'editor'");
    }
};

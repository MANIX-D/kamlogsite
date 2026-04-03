<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Supprimer la table par défaut de Laravel si elle existe
        Schema::dropIfExists('password_reset_tokens');

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->string('token_hash', 128); // SHA-256 hash du token
            $table->string('code', 6);          // Code de vérification 6 chiffres
            $table->timestamp('expires_at')->useCurrent();
            $table->timestamp('used_at')->nullable();
            $table->timestamp('verified_at')->nullable(); // Code validé, en attente de nouveau mdp
            $table->timestamps();

            $table->index('token_hash');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
    }
};

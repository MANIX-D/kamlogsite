<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email', 255)->unique();
            $table->string('nom', 255)->nullable();
            $table->string('prenom', 255)->nullable();
            $table->string('entreprise', 255)->nullable();
            $table->enum('statut', ['actif', 'desinscrit', 'en_attente'])->default('actif');
            $table->string('token_desinscription', 255)->unique()->nullable();
            $table->timestamp('date_inscription')->nullable();
            $table->timestamp('date_desinscription')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('statut');
            $table->index('date_inscription');
            $table->index(['statut', 'date_inscription']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
    }
};

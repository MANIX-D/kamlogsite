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
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 255);
            $table->string('email', 255);
            $table->string('telephone', 50)->nullable();
            $table->string('entreprise', 255)->nullable();
            $table->string('sujet', 255);
            $table->text('message');
            $table->enum('statut', ['nouveau', 'en_cours', 'traite', 'archive'])->default('nouveau');
            $table->boolean('lu')->default(false);
            $table->text('reponse')->nullable();
            $table->timestamp('date_reponse')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('email');
            $table->index('statut');
            $table->index('lu');
            $table->index('created_at');
            $table->index(['statut', 'lu']);
            $table->index(['statut', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};

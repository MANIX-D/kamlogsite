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
        Schema::create('infrastructures', function (Blueprint $table) {
            $table->id();
            $table->string('nom_fr', 255);
            $table->string('nom_en', 255);
            $table->text('description_fr');
            $table->text('description_en');
            $table->string('surface', 100)->nullable();
            $table->string('capacite', 100)->nullable();
            $table->string('image', 500)->nullable();
            $table->string('image_alt_fr', 255)->nullable();
            $table->string('image_alt_en', 255)->nullable();
            $table->enum('type', ['entrepot', 'bureau', 'atelier', 'showroom', 'autre'])->default('entrepot');
            $table->json('equipements')->nullable();
            $table->json('specifications_techniques')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_available')->default(true);
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('type');
            $table->index('is_active');
            $table->index('is_available');
            $table->index('display_order');
            $table->index(['is_active', 'is_available']);
            $table->index(['type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('infrastructures');
    }
};

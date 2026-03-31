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
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('titre_fr', 255);
            $table->string('titre_en', 255);
            $table->text('contenu_fr');
            $table->text('contenu_en');
            $table->string('slug_fr', 255)->unique();
            $table->string('slug_en', 255)->unique();
            $table->enum('type', ['article', 'annonce', 'offre'])->default('article');
            $table->string('image', 500)->nullable();
            $table->string('image_alt_fr', 255)->nullable();
            $table->string('image_alt_en', 255)->nullable();
            $table->date('date_publication');
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('views')->default(0);
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('type');
            $table->index('date_publication');
            $table->index('is_published');
            $table->index('is_featured');
            $table->index(['is_published', 'date_publication']);
            $table->index(['type', 'is_published']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};

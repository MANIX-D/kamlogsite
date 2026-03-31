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
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->string('titre_fr');
            $table->string('titre_en');
            $table->text('contenu_fr');
            $table->text('contenu_en');
            $table->enum('type', ['article', 'annonce', 'offre'])->default('article');
            $table->string('image')->nullable();
            $table->date('date_publication');
            $table->timestamps();

            $table->index('type');
            $table->index('date_publication');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actualites');
    }
};

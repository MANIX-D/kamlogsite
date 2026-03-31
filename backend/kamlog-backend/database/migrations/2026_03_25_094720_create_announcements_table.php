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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title_fr', 255);
            $table->string('title_en', 255);
            $table->text('content_fr');
            $table->text('content_en');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->enum('type', ['info', 'alerte', 'maintenance', 'promotion'])->default('info');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_popup')->default(false);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('background_color', 20)->nullable();
            $table->string('text_color', 20)->nullable();
            $table->string('icon', 100)->nullable();
            $table->string('button_text_fr', 255)->nullable();
            $table->string('button_text_en', 255)->nullable();
            $table->string('button_url', 500)->nullable();
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('is_active');
            $table->index('priority');
            $table->index('type');
            $table->index('start_date');
            $table->index('end_date');
            $table->index(['is_active', 'start_date', 'end_date']);
            $table->index(['priority', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};

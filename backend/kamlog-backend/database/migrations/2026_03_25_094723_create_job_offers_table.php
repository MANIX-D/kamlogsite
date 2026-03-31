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
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('title_fr', 255);
            $table->string('title_en', 255);
            $table->text('description_fr');
            $table->text('description_en');
            $table->text('requirements_fr');
            $table->text('requirements_en');
            $table->text('benefits_fr')->nullable();
            $table->text('benefits_en')->nullable();
            $table->enum('contract_type', ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance']);
            $table->string('location', 255);
            $table->enum('experience_level', ['junior', 'confirme', 'senior', 'expert']);
            $table->string('salary_range', 100)->nullable();
            $table->string('department', 100)->nullable();
            $table->date('application_deadline');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_urgent')->default(false);
            $table->integer('applications_count')->default(0);
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('is_active');
            $table->index('is_urgent');
            $table->index('contract_type');
            $table->index('experience_level');
            $table->index('location');
            $table->index('application_deadline');
            $table->index(['is_active', 'application_deadline']);
            $table->index(['contract_type', 'is_active']);
            $table->index(['location', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};

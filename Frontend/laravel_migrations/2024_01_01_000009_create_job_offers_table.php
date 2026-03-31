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
            $table->string('title_fr');
            $table->string('title_en');
            $table->text('description_fr');
            $table->text('description_en');
            $table->text('requirements_fr')->nullable();
            $table->text('requirements_en')->nullable();
            $table->enum('contract_type', ['CDI', 'CDD', 'Stage', 'Freelance'])->default('CDI');
            $table->string('location');
            $table->string('experience_level')->nullable();
            $table->string('salary_range')->nullable();
            $table->date('application_deadline')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('contract_type');
            $table->index('is_active');
            $table->index('application_deadline');
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

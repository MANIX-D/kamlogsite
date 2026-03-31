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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_offer_id')->constrained()->onDelete('cascade');
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('email', 255);
            $table->string('phone', 50)->nullable();
            $table->string('address', 500)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('linkedin_url', 500)->nullable();
            $table->string('portfolio_url', 500)->nullable();
            $table->text('cover_letter')->nullable();
            $table->string('cv_path', 500)->nullable();
            $table->enum('status', ['en_attente', 'en_cours', 'acceptee', 'refusee'])->default('en_attente');
            $table->text('notes_admin')->nullable();
            $table->timestamp('application_date');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('email');
            $table->index('status');
            $table->index('application_date');
            $table->index(['job_offer_id', 'status']);
            $table->index(['status', 'application_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};

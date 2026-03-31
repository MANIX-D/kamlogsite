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
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();
            $table->string('company_name', 255);
            $table->string('contact_person', 255);
            $table->string('email', 255);
            $table->string('phone', 50);
            $table->string('address', 500);
            $table->enum('service_type', ['logistique', 'stockage', 'transport', 'personnalise']);
            $table->text('project_description');
            $table->json('requirements')->nullable();
            $table->string('budget_range', 100)->nullable();
            $table->date('desired_start_date')->nullable();
            $table->date('desired_end_date')->nullable();
            $table->enum('priority', ['basse', 'normale', 'haute', 'urgente'])->default('normale');
            $table->enum('status', ['nouveau', 'en_cours', 'envoyé', 'accepte', 'refuse'])->default('nouveau');
            $table->decimal('estimated_amount', 10, 2)->nullable();
            $table->text('notes_admin')->nullable();
            $table->string('quote_document_path', 500)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('email');
            $table->index('status');
            $table->index('priority');
            $table->index('service_type');
            $table->index('created_at');
            $table->index(['status', 'priority']);
            $table->index(['service_type', 'status']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};

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
        Schema::create('visit_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('email', 255);
            $table->string('phone', 50);
            $table->string('company', 255)->nullable();
            $table->date('date');
            $table->time('heure')->nullable();
            $table->enum('type_visite', ['guidee', 'autonome', 'virtuelle', 'rencontre'])->default('guidee');
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->text('notes_admin')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->foreignId('infrastructure_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('email');
            $table->index('date');
            $table->index('status');
            $table->index('type_visite');
            $table->index(['status', 'date']);
            $table->index(['date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visit_requests');
    }
};

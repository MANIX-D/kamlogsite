<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_invitations', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->enum('role', ['super_admin', 'admin', 'editor'])->default('editor');
            $table->json('permissions')->nullable(); // Sections autorisées pour les éditeurs (avec niveaux)
            $table->string('token', 128)->unique(); // Token sécurisé hashé
            $table->foreignId('invited_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('accepted_at')->nullable();
            $table->foreignId('accepted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('expires_at')->useCurrent();
            $table->timestamps();

            $table->index('email');
            $table->index('expires_at');
            $table->index(['email', 'accepted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_invitations');
    }
};

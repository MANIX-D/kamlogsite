<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('section', [
                'actualites',
                'announcements',
                'job_offers',
                'quotes',
                'messages',
                'newsletter',
                'visit_requests',
                'services',
                'partners',
                'infrastructures',
            ]);
            $table->boolean('can_read')->default(true);
            $table->boolean('can_write')->default(false);
            $table->boolean('can_delete')->default(false);
            $table->timestamps();

            // Un utilisateur ne peut avoir qu'une entrée par section
            $table->unique(['user_id', 'section']);
            $table->index('user_id');
            $table->index('section');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
    }
};

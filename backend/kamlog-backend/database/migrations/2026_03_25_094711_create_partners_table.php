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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name_fr', 255);
            $table->string('name_en', 255);
            $table->string('logo_url', 500)->nullable();
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();
            $table->string('category', 100)->nullable();
            $table->string('website', 500)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('address', 500)->nullable();
            $table->enum('partnership_level', ['strategic', 'premium', 'standard', 'basic'])->default('standard');
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->softDeletes();
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('category');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('display_order');
            $table->index('partnership_level');
            $table->index(['is_active', 'display_order']);
            $table->index(['category', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};

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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('company')->nullable();
            $table->string('service_type');
            $table->text('description');
            $table->string('origin')->nullable();
            $table->string('destination')->nullable();
            $table->string('cargo_type')->nullable();
            $table->string('cargo_weight')->nullable();
            $table->string('cargo_dimensions')->nullable();
            $table->date('expected_date')->nullable();
            $table->enum('status', ['pending', 'processing', 'quoted', 'closed'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->decimal('quoted_price', 10, 2)->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('service_type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};

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
        Schema::table('visit_requests', function (Blueprint $table) {
            $table->dropForeign(['infrastructure_id']);
            $table->string('infrastructure_id', 50)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visit_requests', function (Blueprint $table) {
            $table->unsignedBigInteger('infrastructure_id')->nullable()->change();
            $table->foreign('infrastructure_id')->references('id')->on('infrastructures')->onDelete('set null');
        });
    }
};

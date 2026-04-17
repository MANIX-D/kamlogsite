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
        Schema::table('job_applications', function (Blueprint $table) {
            // Drop the old foreign key constraint
            $table->dropForeign(['job_offer_id']);
            
            // Add new foreign key pointing to news table
            $table->foreign('job_offer_id')
                  ->references('id')
                  ->on('news')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            // Drop the new foreign key
            $table->dropForeign(['job_offer_id']);
            
            // Restore the old foreign key pointing to job_offers table
            $table->foreign('job_offer_id')
                  ->references('id')
                  ->on('job_offers')
                  ->onDelete('cascade');
        });
    }
};

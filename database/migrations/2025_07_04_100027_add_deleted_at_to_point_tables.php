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
        Schema::table('station_points', function (Blueprint $table) {
            $table->timestamp('deleted_at')->nullable();
        });
        
        Schema::table('note_points', function (Blueprint $table) {
            $table->timestamp('deleted_at')->nullable();
        });
        
        Schema::table('jaune_points', function (Blueprint $table) {
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('station_points', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        
        Schema::table('note_points', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        
        Schema::table('jaune_points', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }
};

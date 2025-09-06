<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('station_points', function (Blueprint $table) {
            // TEXT can store a long list of coordinates as a JSON string
            $table->text('polyline')->nullable()->after('level');
        });
    }

    public function down(): void
    {
        Schema::table('station_points', function (Blueprint $table) {
            $table->dropColumn('polyline');
        });
    }
};
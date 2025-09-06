<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queue_user_positions', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->unsignedBigInteger('station_point_id');
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('station_point_id')->references('id')->on('station_points')->onDelete('cascade');

            // Add a unique constraint to ensure a user can only be in one queue at a time.
            $table->unique(['user_id', 'station_point_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue_user_positions');
    }
};
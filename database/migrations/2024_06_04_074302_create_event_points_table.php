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
        Schema::create('event_points', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('pointId')->unique();
            $table->string('lieu', 100);
            $table->string('type', 20)->nullable();
            $table->string('dates');
            $table->string('heureDebut', 20);
            $table->string('heureFin', 20)->nullable();
            $table->string('level', 1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_points');
    }
};

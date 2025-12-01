<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_participation', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->unique();
            $table->integer('current_points')->default(30);
            $table->integer('max_points')->default(50);
            $table->date('last_connection');
            $table->timestamps();
        }); // <-- point-virgule ajouté ici
    }

    public function down(): void
    {
        Schema::dropIfExists('user_participation');
    }
};

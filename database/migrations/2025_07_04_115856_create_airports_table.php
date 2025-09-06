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
        Schema::create('airports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('abbreviation', 10)->unique();
            $table->string('nbFile')->nullable();
            $table->integer('nbVan')->default(0);
            $table->string('nbGrandeFile')->nullable();
            $table->string('nbPetiteFile')->nullable();
            $table->string('attenteBAT')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('airports');
    }
};

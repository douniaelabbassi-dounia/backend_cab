<?php

use App\Models\User;
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
        Schema::create('chauffeurs', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->string('pseudo', 50)->unique();
            $table->string('carBrind', 500);
            $table->string('categorie', 10);
            $table->string('numCardPro', 30);
            $table->foreignId('imageRectoId');
            $table->foreignId('imageVersoId');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chauffeurs');
    }
};

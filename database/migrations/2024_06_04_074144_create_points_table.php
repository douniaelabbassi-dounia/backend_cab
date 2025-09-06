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
        Schema::create('points', function (Blueprint $table) {
            $table->id();
            $table->string('name',50);
            $table->string('address',100)->nullable();
            $table->string('lat',20);
            $table->string('lng',20);
            $table->string('userID',255);
            $table->string('typePoint',20); // red, event ...
            $table->integer('like')->default(0);
            $table->integer('dislike')->default(0);
            $table->string('status', 10)->default('active'); // active, transparent, unactive
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points');
    }
};

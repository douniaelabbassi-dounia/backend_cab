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
          Schema::create('station_points', function (Blueprint $table) {
              $table->id();
              $table->unsignedBigInteger('pointId');
              $table->string('level')->nullable();
              $table->string('name')->nullable();
              $table->string('lieu')->nullable();
              $table->string('type')->nullable();
              $table->string('dates')->nullable();
              $table->string('heureDebut')->nullable();
              $table->string('heureFin')->nullable();
              $table->timestamps();

              $table->foreign('pointId')->references('id')->on('points')->onDelete('cascade');
          });
      }

      /**
       * Reverse the migrations.
       */
      public function down(): void
      {
          Schema::dropIfExists('station_points');
      }
  };

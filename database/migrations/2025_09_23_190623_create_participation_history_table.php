<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participation_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->string('action_type');
            $table->integer('points_change');
            $table->integer('points_before');
            $table->integer('points_after');
            $table->string('reason');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participation_history');
    }
};
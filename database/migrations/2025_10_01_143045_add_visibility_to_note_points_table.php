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
        Schema::table('note_points', function (Blueprint $table) {
            $table->string('visibility')->default('personne')->after('commentaire'); // 'personne' or 'all'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('note_points', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });
    }
};

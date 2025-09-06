<?php

use App\Models\PublicationMedia;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->integer('order');
            $table->boolean('active')->default(true);
            $table->integer('view_number')->default(0);
            $table->integer('click_number')->default(0);
            $table->foreignIdFor(PublicationMedia::class)->nullable()->constrained('publication_medias')->cascadeOnDelete()->cascadeOnUpdate();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
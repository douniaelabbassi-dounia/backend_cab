<?php

use App\Models\Abonnement;
use App\Models\Role;
use App\Models\Image;
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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('firstName');
            $table->foreignIdFor(Image::class)->nullable();
            $table->string('lastName');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('status', 20)->default("active"); // active, toValidate, toVerify, suspended
            $table->string('ray')->default('300');
            $table->string('visibility', 20)->default('personnel'); // all, friends, private
            $table->string('pointDuration', 20)->default('15'); // all, friends, private
            $table->boolean('seeNotesPoint')->default(true); // all, friends, private
            $table->integer('likes')->default(0);
            $table->integer('dislikes')->default(0);
            $table->string('notification', 100)->default('Niv 3 et 4,Direct'); // ALL, DIRECTS, LEVEL_3_AND_4, DISABLED
            $table->string('lastPosition')->nullable(); // { lat:float, lon:float}
            $table->boolean('isSubscribe')->default(false);
            $table->dateTime('subDateExp')->nullable();
            $table->foreignIdFor(Abonnement::class)->nullable();
            $table->foreignIdFor(Role::class)->nullable();

            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

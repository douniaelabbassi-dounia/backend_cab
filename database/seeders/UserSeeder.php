<?php

namespace Database\Seeders;

use App\Models\Abonnement;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void

    
    {
        // Find user including soft deleted ones
        $user = User::withTrashed()->where('email', 'test@gmail.com')->first();
        
        if ($user) {
            // If user exists (even if soft deleted), restore and update
            if ($user->trashed()) {
                $user->restore();
            }
            $user->update([
                'firstName' => 'Test',
                'lastName' => 'User',
                'password' => Hash::make('12345678'),
                'role_id' => 2,
                'status' => 'active',
            ]);
        } else {
            // Create new user
            $user = User::create([
                'email' => 'test@gmail.com',
                'firstName' => 'Test',
                'lastName' => 'User',
                'password' => Hash::make('12345678'),
                'role_id' => 2,
                'status' => 'active',
            ]);
        }

        // Create chauffeur profile if it doesn't exist
        $chauffeurExists = DB::table('chauffeurs')->where('user_id', $user->id)->exists();
        if (!$chauffeurExists) {
            DB::table('chauffeurs')->insert([
                'user_id' => $user->id,
                'pseudo' => 'testchauffeur',
                'carBrind' => 'Test Car Brand',
                'categorie' => 'A',
                'numCardPro' => 'TEST123456',
                'imageRectoId' => 1,
                'imageVersoId' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        // for ($i = 0; $i < 100; $i++) {

        //     User::create([
        //         'firstName' => fake()->userName(),
        //         'lastName' => fake()->lastName(),
        //         'email' => fake()->email(),
        //         'password' => Hash::make('password'),
        //         'role_id' => fake()->randomElement(Role::all('id')->pluck('id')->toArray()),
        //         'created_at' => fake()->dateTimeBetween('2022-01-01','2024-12-31'),
        //         'abonnement_id' =>fake()->randomElement(Abonnement::all('id')->pluck('id')->toArray())

        //     ]);
        // }
    }
}

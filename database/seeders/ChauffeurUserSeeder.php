<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ChauffeurUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'chauffeur@gmail.com'],
            [
                'firstName' => 'Jean',
                'lastName' => 'Chauffeur',
                'password' => Hash::make('12345678'),
                'role_id' => 2,
                'participation_score' => 0,
            ]
        );
    }
}
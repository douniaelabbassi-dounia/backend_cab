<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@gmail.com')->first();

        if ($user) {
            $user->update([
                'firstName' => 'test',
                'lastName' => 'user',
                'password' => Hash::make('12345678'),
                'role_id' => 3,
                'participation_score' => 40,
            ]);
        } else {
            User::create([
                'email' => 'test@gmail.com',
                'firstName' => 'test',
                'lastName' => 'user',
                'password' => Hash::make('12345678'),
                'role_id' => 3,
                'participation_score' => 40,
            ]);
        }
    }
}
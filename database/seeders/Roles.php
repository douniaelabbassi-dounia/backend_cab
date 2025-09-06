<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Roles extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            
            
            [
                'role_name' => 'organisateur',
            ],
            [
                'role_name' => 'chauffeur',
            ],
            [
                'role_name' => 'admin',
            ]
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}

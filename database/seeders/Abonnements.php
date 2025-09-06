<?php

namespace Database\Seeders;

use App\Models\Abonnement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Abonnements extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $abonnements = [
            [
                'name' => 'Abonnement 1',
                'type' => '---',
                'price' => 3,
                'isPromotion' => false,
            ],
            [
                'name' => 'Abonnement 2',
                'type' => '----',
                'price' => 4.99,
                'isPromotion' => false,
            ],
            
        ];

        foreach ($abonnements as $abonnement) {
            Abonnement::create($abonnement);
        }
    }
}

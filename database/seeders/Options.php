<?php

namespace Database\Seeders;

use App\Models\Abonnement;
use App\Models\OptionSub;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Options extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            [
                'content' => 'Automatisation du calcul de l’attente',
                'abonnement_id' => 1,
            ],
            [
                'content' => 'Accès aux notes',
                'abonnement_id' => 1,
            ],
            [
                'content' => 'Automatisation du calcul de l’attente',
                'abonnement_id' => 2,
            ],
            [
                'content' => 'Accès aux notes',
                'abonnement_id' => 2,
            ]
       ];

       foreach ($options as $option) {
            OptionSub::created($option);
       }
    }
}

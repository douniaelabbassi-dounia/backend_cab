<?php

namespace Database\Seeders;

use App\Models\Airport;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AirportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Airport::updateOrCreate(
            ['abbreviation' => 'CDG'],
            [
                'name' => 'Aéroport Charles de Gaulle',
                'nbFile' => '1',
                'nbVan' => 1,
                'attenteBAT' => '1h 49m',
            ]
        );

        Airport::updateOrCreate(
            ['abbreviation' => 'ORLY'],
            [
                'name' => 'Aéroport Orly',
                'nbFile' => '7,3G et 3P',
                'nbVan' => 6,
                'nbGrandeFile' => '7,3G',
                'nbPetiteFile' => '3P',
                'attenteBAT' => '1h 20m',
            ]
        );
    }
}

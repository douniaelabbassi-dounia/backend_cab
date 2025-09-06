<?php

namespace Database\Seeders;

use App\Models\Publication;
use App\Models\PublicationUserView;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PublicationUserViewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $all_publication = Publication::all();
        $all_user_id = User::all('id')->pluck('id')->toArray();
       
        foreach ($all_publication as $publication) {
            for ($i = 0; $i < ($publication->view_number??0); $i++) {
                PublicationUserView::create([
                    'user_id'=>fake()->randomElement($all_user_id),
                    'publication_id'=>$publication->id,
                    'type'=>'view',
                    'created_at' => fake()->dateTimeBetween('2024-01-01','2024-12-31'),
                    
                ]);
            }

            for ($i = 0; $i < ($publication->click_number??0); $i++) {
                PublicationUserView::create([
                    'user_id'=>fake()->randomElement($all_user_id),
                    'publication_id'=>$publication->id,
                    'type'=>'click',
                    'created_at' => fake()->dateTimeBetween('2024-01-01','2024-12-31'),
                    
                ]);
            }
            
        }
    }
}

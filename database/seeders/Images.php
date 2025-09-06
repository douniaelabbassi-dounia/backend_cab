<?php

namespace Database\Seeders;

use App\Models\Image;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Images extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $images = [
            [
                'url' => 'https://media.licdn.com/dms/image/D4E03AQGM7EaPKzXbrQ/profile-displayphoto-shrink_800_800/0/1696715017288?e=1717632000&v=beta&t=BN6rQ6RK5UQ0wSkXtEeHRiDSSEa2ez6FsMHcW1NmMXA',
                'type' => 'image',

            ]
        ];

        foreach ($images as $image) {
            Image::create($image);
        }
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicationMedia extends Model
{
    use HasFactory;
    protected $table = 'publication_medias';
    protected $fillable = ['url','type'];

}

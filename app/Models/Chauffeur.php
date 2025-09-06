<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chauffeur extends Model
{
    use HasFactory;
    


    function recto() {
        return $this->hasOne(Image::class, 'imageRectoId');
    }

    function verso() {
        return $this->hasOne(Image::class, 'imageVersoId');
    }

    function user() {
        return $this->belongsTo(User::class);
    }
}

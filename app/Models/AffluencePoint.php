<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AffluencePoint extends Model
{
    use HasFactory, SoftDeletes;

    function point() {
        return $this->belongsTo(Point::class);
    }
}

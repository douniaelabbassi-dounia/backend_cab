<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StationPoint extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $table = 'station_points';

    function point() {
        return $this->belongsTo(Point::class);
    }
}

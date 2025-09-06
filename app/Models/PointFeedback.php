<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PointFeedback extends Model
{
    use HasFactory;

    function point() {
        return $this->belongsTo(Point::class);
    }
}

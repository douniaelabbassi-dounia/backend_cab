<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Point extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    function affluence() {
        return $this->hasOne(AffluencePoint::class, 'pointId');
    }

    function event() {
        return $this->hasOne(EventPoint::class, 'pointId');
    }
    function station() {
        return $this->hasOne(StationPoint::class, 'pointId');
    }
    function note() {
        return $this->hasOne(NotePoint::class, 'pointId');
    }
    function sos() {
        return $this->hasOne(JaunePoint::class, 'pointId');
    }

    function user() {
        return $this->belongsTo(User::class, 'userID');
    }

    function feedback() {
        return $this->hasMany(PointFeedback::class, 'pointId');
    }
}

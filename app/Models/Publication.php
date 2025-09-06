<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;
    protected $table = 'publications';

    protected $fillable = [
        'title',
        'order',
        'active',
        'view_number',
        'click_number'
    ];

    function media() {
        return $this->hasOne(PublicationMedia::class,'id', 'publication_media_id');
    }

    function user(){
        return $this->belongsToMany(User::class,PublicationUserView::class,'user_id','publication_id');
    }

    public function publicationViewsClick()
    {
        return $this->hasMany(PublicationUserView::class, 'publication_id');
    }
}

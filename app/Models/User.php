<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserStatus;
use Illuminate\Broadcasting\Broadcasters\AblyBroadcaster;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstName',
        'lastName',
        'email',
        'password',
        'role_id',
        'participation_score'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login_at' => 'datetime',
    ];

    function role() {
        return $this->belongsTo(Role::class, 'role_id');
    }

    function chauffeur() {
        return $this->hasOne(Chauffeur::class);
    }

    function organisateur() {
        return $this->hasOne(Organisateur::class);
    }

    function image() {
        return $this->hasOne(Image::class,'id', 'image_id');
    }

    function abbonement() {
        return $this->hasOne(Abonnement::class);
    }

    function friends() {
        return $this->hasMany(Friend::class);
    }

    function publication(){
        return $this->belongsToMany(Publication::class,PublicationUserView::class,'publication_id','user_id');
    }

}

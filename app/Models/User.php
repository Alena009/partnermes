<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens,Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'kod', 'lastname', 'firstname', 'login', 'api_token', 'is_worker'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    /*
     * User have roles (for tree view on front-end)
     */
    public function role()
    {
        return $this->belongsToMany('App\Models\Role', 'users_roles', 'user_id', 'role_id');
    }
    
    /*
     * get all operations which related to this user
     */
    public function operations() 
    {
        return $this->hasMany('App\Models\Operation', 'user_id', 'id');
    } 
    
    /*
     * get all opened operations which related to this user
     */
    public function openedOperations() 
    {
        return $this->hasMany('App\Models\Operation', 'user_id', 'id')->where("closed", "<", 1);
    }     
}

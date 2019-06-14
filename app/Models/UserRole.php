<?php

namespace App\Models;

use \App\Models\BaseModel;

class UserRole extends BaseModel
{
    protected $table = 'users_roles';
    
    protected $fillable = [
        'user_id', 'role_id'
    ];  
}

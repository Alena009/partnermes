<?php

namespace App\Models;

use \App\Models\BaseModel;

class RolePermission extends BaseModel
{
    protected $table = 'roles_permissions';
    
    protected $fillable = [
        'permission_id', 'role_id', 'value'
    ]; 
}

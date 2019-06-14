<?php

namespace App\Models;

use \App\Models\BaseModel;

class Permission extends BaseModel
{
    use \Dimsav\Translatable\Translatable; 
    
    protected $table = "permissions";
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];
    
    public function values()
    {
        return $this->hasMany("App\Models\RolePermission", 'permission_id', 'id') ;
    }
}

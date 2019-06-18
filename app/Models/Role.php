<?php

namespace App\Models;

use \App\Models\BaseModel;

class Role extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "roles";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];
    
    /*
     * Role have users (for tree view on front-end)
     */
    public function users() 
    {
        //return $this->hasMany("App\Models\UserRole", 'role_id', 'id') ;
        return $this->belongsToMany("App\Models\User", 'users_roles', 'role_id', 'user_id');
    }
    
    /*
     * Role have permisiions
     */    
    public function permissions() 
    {
        return $this->belongsToMany("App\Models\Permission", 'roles_permissions', 'role_id', 'permission_id');
    }
    
    /**
     * 
     * @return type
     */
    public function permissionsValues()
    {
        return $this->hasMany("App\Models\RolePermission", 'role_id', 'id') ;
    }
    
    public function getName()
    {
        return $this->name;
    }
}

<?php

namespace App\Models;

use \App\Models\BaseModel;

class Departament extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = 'departaments';
    
    protected $fillable = [
        'name', 'parent_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];
    
    /*
     * Departaments have kids (for tree view on front-end)
     */
    public function kids() 
    {
        return $this->hasMany($this, 'parent_id', 'id') ;
    }    
    
     /*
      * Relation for getting workers list for departament
      */
    public function workers() 
    {  
        return $this->belongsToMany("App\Models\User", "worker_departaments", 'departament_id', 'user_id') ;
    }      
}

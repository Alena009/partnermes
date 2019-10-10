<?php

namespace App\Models;

use \App\Models\BaseModel;

class TaskGroup extends BaseModel
{
    use \Astrotomic\Translatable\Translatable;
    
    protected $table = "tasks_groups";
    
    protected $fillable = [
        'name', 'parent_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];
    
    /*
     * Group have kids (for tree view on front-end)
     */
    public function kids() 
    {
        return $this->hasMany($this, 'parent_id', 'id') ;
    }    
}

<?php

namespace App\Models;

use \App\Models\BaseModel;

class TaskGroup extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "tasks_groups";
    
    protected $fillable = [
        'name', 'parent_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];    
}
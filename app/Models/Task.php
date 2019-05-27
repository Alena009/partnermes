<?php

namespace App\Models;

use \App\Models\BaseModel;

class Task extends BaseModel
{
    protected $table = "tasks";
    
    protected $fillable = [
        'kod', 'name', 'for_order', 'task_group_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];
}

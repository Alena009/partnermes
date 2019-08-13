<?php

namespace App\Models;

use \App\Models\BaseModel;

class Task extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "tasks";
    
    protected $fillable = [
        'kod', 'name', 'for_order', 'task_group_id', 'amount_start', 'amount_stop'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];      
    
    public function group()
    {
        return $this->belongsTo('App\Models\TaskGroup', 'task_group_id', 'id');
    }     
}

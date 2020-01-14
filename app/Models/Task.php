<?php

namespace App\Models;

use \App\Models\BaseModel;

class Task extends BaseModel
{
    use \Astrotomic\Translatable\Translatable;
    
    protected $table = "tasks";
    
    protected $fillable = [
        'kod', 'name', 'task_group_id', 'for_order'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];      
    
    public function group()
    {
        return $this->belongsTo('App\Models\TaskGroup', 'task_group_id', 'id');
    } 
    
    public function products()
    {
        return $this->belongsToMany('App\Models\Product', 'product_tasks', 'task_id', 'product_id')
                ->withPivot('duration', 'priority')
                ->withTimestamps();        
    }    
}

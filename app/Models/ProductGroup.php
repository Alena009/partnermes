<?php

namespace App\Models;

use \App\Models\BaseModel;

class ProductGroup extends BaseModel
{
    use \Astrotomic\Translatable\Translatable; 
    
    protected $table = 'product_groups';
    
    protected $fillable = [
        'name', 'parent_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];  
    
    public function kids() 
    {
        return $this->hasMany($this, 'parent_id', 'id') ;
    }    
    
    public function products()
    {
        return $this->hasMany('App\Models\Product', 'product_group_id', 'id');
    }
    
    public function tasks()
    {
        return $this->belongsToMany('App\Models\Task', 'product_groups_tasks', 
                'product_group_id', 'task_id')
                ->withPivot('duration', 'priority')
                ->withTimestamps()
                ->orderBy("priority", "asc");        
    }      
}

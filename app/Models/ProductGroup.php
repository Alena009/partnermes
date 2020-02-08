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
    
    public function parent() 
    {
        return $this->hasOne($this, 'id', 'parent_id') ;
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
    
    public function allParents($group, $arr = []) 
    {        
        $arr[] = $group;             
        $parent = $group->parent;           
        if ($parent) {                
            return $this->allParents($parent, $arr);
        } else {
            return $arr;
        }                
    }
    
    public function allTasks()
    {
        $result     = [];       
        $parents = $this->allParents($this);
        foreach ($parents as $parent) {            
            $parentTasks = $parent->tasks; 
            foreach ($parentTasks as $task) {
                $task->product_group_id = $parent->id;
                $result[] = $task; 
            }
        }         
        $groupTasks = $this->tasks;  
        foreach ($groupTasks as $task) {
            $task->product_group_id = $this->id;
            $result[] = $task; 
        }             
        
        foreach ($result as $r) {
            $r->duration         = $r->pivot->duration;
            $r->priority         = $r->pivot->priority;            
            $r->task_id          = $r->id;            
        }
        
        return $result;       
    }      
}

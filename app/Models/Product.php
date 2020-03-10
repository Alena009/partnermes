<?php

namespace App\Models;

use \App\Models\BaseModel;

class Product extends BaseModel
{
    use \Astrotomic\Translatable\Translatable;
    
    protected $table = "products";
    
    protected $fillable = [
        'kod', 'name', 'description', 'pack', 'product_type_id', 'weight', 
        'product_group_id', 'area', 'height', 'width', 'length'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description', 'pack'];
    
    public function group()
    {
        return $this->belongsTo('App\Models\ProductGroup', 'product_group_id', 'id');
    }
    
    public function type()
    {
        return $this->belongsTo('App\Models\ProductType', 'product_type_id', 'id');
    }

    public function tasks()
    {
        return $this->belongsToMany('App\Models\Task', 'product_tasks', 'product_id', 'task_id')
                ->withPivot('duration', 'priority', 'required')
                ->withTimestamps()
                ->orderBy("priority", "asc");        
    }          
    
    public function components()
    {
        return $this->hasMany('App\Models\Component');
    } 
    
    public function warehouseRecords()
    {
        return $this->hasMany('App\Models\Warehouse', 'product_id', 'id');
    }
    
    public function allTasks()
    {
        $group        = $this->group;
        $groupTasks   = collect($this->group->allTasks());
        $productTasks = $this->tasks;
        $result = $groupTasks->merge($productTasks);
        foreach ($result as $r) {
            $r->duration         = $r->pivot->duration;
            $r->priority         = $r->pivot->priority;
            $r->required         = $r->pivot->required;
            $r->task_id          = $r->id;
            $r->product_id       = $this->id;
            $r->product_group_id = $group->id;            
        }        
        return $result;        
    }  
    
    public function getLastTask()
    {
        $tasks = $this->allTasks();
        return $tasks->last();  
    }
    
    public function getTask($taskId)
    {
        $tasks = $this->allTasks();
        return $tasks->where("id", "=", $taskId)->first();  
    }    
    
    public function available()
    {
        return $this->warehouseRecords->sum('amount'); 
    }
}

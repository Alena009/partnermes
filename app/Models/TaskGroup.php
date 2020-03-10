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
    
    public function parent() 
    {
        return $this->hasOne($this, 'id', 'parent_id') ;
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
    
    public function allKids($group, $kids = []) 
    {   
        foreach ($group->kids as $arr) {               
            $kids[] = $arr;            
            if (count($arr->kids)) {                   
                $kids = $this->allKids($arr, $kids);
            }            
        }
        
        return $kids;      
    }    
}

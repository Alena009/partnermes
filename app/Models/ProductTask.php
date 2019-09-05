<?php

namespace App\Models;

use \App\Models\BaseModel;

class ProductTask extends BaseModel
{
    protected $table = 'product_tasks';
    
    protected $fillable = [
        'product_id', 'task_id', 'duration', 'priority'
    ]; 
    
    public function task()
    {
        return $this->belongsTo('App\Models\Task', 'task_id', 'id');
    }
    
    public function product()
    {
        return $this->belongsTo('App\Models\Product', 'product_id', 'id');
    }      
}

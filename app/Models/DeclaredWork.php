<?php

namespace App\Models;

use \App\Models\BaseModel;

class DeclaredWork extends BaseModel
{
    protected $table = 'declared_works';
    
    protected $fillable = [
        'kod', 'order_position_id', 'product_id', 'task_id', 'declared_amount'
    ];
    
    public function orderPosition()
    {
        return $this->belongsTo('App\Models\OrderPosition', 'order_position_id', 'id');
    }
    
    public function task()
    {
        return $this->belongsTo('App\Models\Task', 'task_id', 'id');
    }
    
    public function product()
    {
        return $this->belongsTo('App\Models\Product', 'product_id', 'id');
    }
}

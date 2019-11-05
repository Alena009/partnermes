<?php

namespace App\Models;

use \App\Models\BaseModel;

class Operation extends BaseModel
{
    protected $table = "operations";
    
    protected $fillable = [
        'user_id', 'order_position_id', 'task_id', 'start_amount', 
        'done_amount', 'start_date', 'end_date', 'closed'
    ];
    
//    public function product() 
//    {
//        return $this->belongsTo('App\Models\Product', 'product_id', 'id');
//    }
    
    public function task()
    {
        return $this->belongsTo('App\Models\Task', 'task_id', 'id');
    }
    
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    } 
    
//    public function zlecenie()
//    {
//        return $this->belongsTo('App\Models\DeclaredWork', 'declared_work_id', 'id');
//    }     
//    
    public function position()
    {
        return $this->belongsTo('App\Models\OrderPosition', 'order_position_id', 'id');
    }   
}

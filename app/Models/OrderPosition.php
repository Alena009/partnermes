<?php

namespace App\Models;

use \App\Models\BaseModel;

class OrderPosition extends BaseModel
{
    protected $table = "orders_positions";
    
    protected $fillable = [
        'kod', 'order_id', 'amount', 'date_delivery', 'product_id'
    ];
    
    public function product()
    {
        return $this->belongsTo("App\Models\Product", "product_id", "id");        
    }    
    
    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }
    
    public function tasks()
    {
        return $this->hasMany('App\Models\Task', 'order_position_id', 'id');
    }
}

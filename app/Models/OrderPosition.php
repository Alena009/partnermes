<?php

namespace App\Models;

use \App\Models\BaseModel;

class OrderPosition extends BaseModel
{
    protected $table = "orders_positions";
    
    protected $fillable = [
        'kod', 'order_id', 'amount', 'price', 'description', 'date_delivery', 
        'product_id', 'status', 'date_status'
    ];
    
    public function product()
    {
        return $this->belongsTo("App\Models\Product", "product_id", "id");        
    }    
    
    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }

    public function operations()
    {
        return $this->hasMany('App\Models\Operation', "order_position_id", "id");
    }  
}

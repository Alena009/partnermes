<?php

namespace App\Models;

use \App\Models\BaseModel;

class OrderPosition extends BaseModel
{
    protected $table = "orders_positions";
    
    protected $fillable = [
        'kod', 'order_id', 'amount', 'date_delivery'
    ];
    
    public function product()
    {
        return $this->belongsTo("App\Models\Product", "product_id", "id");        
    }    
}

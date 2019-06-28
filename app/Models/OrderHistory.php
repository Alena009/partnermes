<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use \App\Models\BaseModel;

class OrderHistory extends BaseModel
{
    protected $table = 'orders_history';
    
    protected $fillable = [
        'order_id', 'status_id'
    ];
    
    public function order() 
    {
        return $this->belongsTo('App\Models\Order');
    }    
}

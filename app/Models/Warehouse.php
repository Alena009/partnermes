<?php

namespace App\Models;

use \App\Models\BaseModel;

class Warehouse extends BaseModel
{
    protected $table = 'warehouse';
    
    protected $fillable = [
        'product_id', 'amount'
    ];
    
    public function product()
    {
        return $this->belongsTo('App\Models\Product', 'product_id', 'id');
    }
}

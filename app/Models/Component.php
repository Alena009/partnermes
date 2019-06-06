<?php

namespace App\Models;

use \App\Models\BaseModel;

class Component extends BaseModel
{
    protected $table = "components";
    
    protected $fillable = [
        'product_id', 'component_id', 'amount'
    ];    
}

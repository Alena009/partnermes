<?php

namespace App\Models;

use \App\Models\BaseModel;

class Order extends BaseModel
{    
    protected $table = "orders";
    
    protected $fillable = [
        'kod', 'name', 'client_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];
}

<?php

namespace App\Models;

use \App\Models\BaseModel;

class Order extends BaseModel
{    
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "orders";
    
    protected $fillable = [
        'kod', 'client_id', 'date_start', 'date_end'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];
}

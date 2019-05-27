<?php

namespace App\Models;

use \App\Models\BaseModel;

class ProductType extends BaseModel
{
    use \Dimsav\Translatable\Translatable; 
    
    protected $table = "product_types";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];    
}

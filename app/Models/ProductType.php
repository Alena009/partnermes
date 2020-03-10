<?php

namespace App\Models;

use \App\Models\BaseModel;

class ProductType extends BaseModel
{
    use \Astrotomic\Translatable\Translatable; 
    
    protected $table = "product_types";
    
    protected $fillable = [
        'name', 'description'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];    
}

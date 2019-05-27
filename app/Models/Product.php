<?php

namespace App\Models;

use \App\Models\BaseModel;

class Product extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "products";
    
    protected $fillable = [
        'kod', 'name', 'client_id', 'product_type_id', 'weight', 'pictures', 
        'description', 'product_group_id', 'area', 'pack'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description', 'pack'];
}

<?php

namespace App\Models;

use \App\Models\BaseModel;

class Product extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "products";
    
    protected $fillable = [
        'kod', 'product_type_id', 'weight', 'height', 'width', 'length', 'pictures', 
        'product_group_id', 'area'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description', 'pack'];
    
    public function group()
    {
        return $this->belongsTo('App\Models\ProductGroup', 'product_group_id', 'id');
    }
}

<?php

namespace App\Models;

use \App\Models\BaseModel;

class ProductGroup extends BaseModel
{
    use \Dimsav\Translatable\Translatable; 
    
    protected $table = 'product_groups';
    
    protected $fillable = [
        'name', 'parent_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];    
}

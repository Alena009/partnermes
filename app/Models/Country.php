<?php

namespace App\Models;

use \App\Models\BaseModel;

class Country extends BaseModel
{
    use \Astrotomic\Translatable\Translatable; 
        
    protected $table = "country";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];   
}

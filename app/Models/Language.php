<?php

namespace App\Models;

use \App\Models\BaseModel;

class Language extends BaseModel
{
    use \Astrotomic\Translatable\Translatable; 
    
    protected $table = "language";
    
    protected $fillable = [
        'name', 'short'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'short'];      
}

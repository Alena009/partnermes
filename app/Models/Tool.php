<?php

namespace App\Models;

use \App\Models\BaseModel;

class Tool extends BaseModel
{
    use \Astrotomic\Translatable\Translatable;
    
    protected $table = "tools";
    
    protected $fillable = [
        'kod', 'name', 'description'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];             
}

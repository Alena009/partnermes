<?php

namespace App\Models;

use \App\Models\BaseModel;

class Client extends BaseModel
{
    protected $table = "clients";
    
    protected $fillable = [
        'kod', 'name', 'address', 'country', 'contacts'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'address', 'country', 'contacts'];
}

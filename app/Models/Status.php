<?php

namespace App\Models;

use \App\Models\BaseModel;

class Status extends BaseModel
{
    protected $table = "roles";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];
}

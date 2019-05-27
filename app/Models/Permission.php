<?php

namespace App\Models;

use \App\Models\BaseModel;

class Permission extends BaseModel
{
    protected $table = "permissions";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];
}

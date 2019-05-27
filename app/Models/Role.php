<?php

namespace App\Models;

use \App\Models\BaseModel;

class Role extends Model
{
    protected $table = "roles";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];
}

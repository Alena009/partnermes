<?php

namespace App\Models;

use \App\Models\BaseModel;

class Role extends Model
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "roles";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];
}

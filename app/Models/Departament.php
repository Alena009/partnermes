<?php

namespace App\Models;

use \App\Models\BaseModel;

class Departament extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = 'departaments';
    
    protected $fillable = [
        'name', 'parent_id'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name'];

}

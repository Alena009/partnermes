<?php

namespace App\Models;
use \App\Models\BaseModel;

class Worker extends BaseModel
{
    use \Dimsav\Translatable\Translatable;
    
    protected $table = 'workers';
    protected $fillable = [
        'kod','firstname','lastname'
    ];
}

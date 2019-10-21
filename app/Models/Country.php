<?php

namespace App\Models;

use \App\Models\BaseModel;

class Country extends BaseModel
{
    protected $table = "country";
    
    protected $fillable = [
        'name'
    ];
}

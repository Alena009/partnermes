<?php

namespace App\Models;

use \App\Models\BaseModel;

class Language extends BaseModel
{
    protected $table = "language";
    
    protected $fillable = [
        'name', 'short'
    ];
}

<?php

namespace App\Models;
use \App\Models\BaseModel;

class Worker extends BaseModel
{
    protected $table = 'workers';
    protected $fillable = [
        'kod','firstname','lastname'
    ];
}

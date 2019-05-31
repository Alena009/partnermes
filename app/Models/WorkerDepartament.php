<?php

namespace App\Models;

use \App\Models\BaseModel;

class WorkerDepartament extends BaseModel
{
    protected $table = 'worker_departaments';
    
    protected $fillable = [
        'user_id', 'departament_id'
    ];   
    
}

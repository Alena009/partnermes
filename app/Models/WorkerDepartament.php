<?php

namespace App\Models;

use \App\Models\BaseModel;

class WorkerDepartament extends BaseModel
{
    protected $table = 'worker_departaments';
    
    protected $fillable = [
        'user_id', 'departament_id'
    ]; 
    
    /**
     * Return array of workers ids by departaments where they work
     * 
     * @param array $departamentsIds
     * @return array
     */
    function getWorkersIdsByDepartamentsIds($departamentsIds) 
    {
        return $this::whereIn('departament_id', $departamentsIds)->pluck('user_id');
    }
    
}

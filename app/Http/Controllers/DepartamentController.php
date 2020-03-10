<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\DepartamentRepository;
use App\Models\Departament;
use App\Models\User;
use App\Models\WorkerDepartament;

class DepartamentController extends BaseController
{
    private $rep;
    
    public function __construct(DepartamentRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    /**
     * Getting workers list for each departament by departamnets ids
     * 
     * @param array $departamentsIds
     * @return array $workers
     */
    public function workersList($departamentsIds = 0)
    {   
        $result = [];
        
        if ($departamentsIds) {            
            $departamentsIds = explode(',', $departamentsIds);
            $allDepartamentsIdsWithChildNodes = Departament::whereIn("id", $departamentsIds)
                    ->orWhereIn("parent_id", $departamentsIds)->pluck('id');            
            $workersIds = WorkerDepartament::whereIn('departament_id', $allDepartamentsIdsWithChildNodes)
                    ->pluck('user_id');            
            $result = User::find($workersIds);            
        } else {
           $result =  User::all();
        }
        
        return response()->json(['data' => $result, 'success' => true]);        
    }   
}

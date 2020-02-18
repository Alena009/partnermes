<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\WorkerDepartamentRepository;

class WorkerDepartamentController extends BaseController
{
    private $rep;
    
    public function __construct(WorkerDepartamentRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }  
    
    public function deleteWorker($departamentId, $workerId) 
    {
        $model = $this->repository->getModel();                      
        
        if ($model::where('user_id', '=', $workerId)
                ->where('departament_id', '=', $departamentId)
                ->delete()) {
            $result = ['success' => true];          
        } else {
            $result = ['success' => false];        
        }            
        return response()->json($result);        
    }
}

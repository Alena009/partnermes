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
    
    public function deleteRel(Request $request) 
    {
        $model = $this->repository->getModel();                      
        
        if ($model::where('user_id', '=', $request->user_id)
                ->where('departament_id', '=', $request->departament_id)
                ->delete()) {
            $result = ['success' => true];          
        } else {
            $result = ['success' => false];        
        }            
        return response()->json($result);        
    }
}

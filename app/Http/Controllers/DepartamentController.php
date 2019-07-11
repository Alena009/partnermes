<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\DepartamentRepository;

class DepartamentController extends BaseController
{
    private $rep;
    
    public function __construct(DepartamentRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    /**
     * get departaments list with translations
     */
    public function index($locale = 'pl')
    {
        $result = [];
        $departaments = [];        
        
        app()->setLocale($locale);

        $departaments = \App\Models\Departament::all();
        
        //adding column "text" and "value" for correct viewing in combobox front-end
        foreach ($departaments as $departament) {
            $departament->text = $departament->name;  
            $departament->value = (string)$departament->id;           
        }

        //$departaments = $this->index();
        $result = ['data' => $departaments, 'success' => true];
        
        return response()->json($result);
    }
    
    /**
     * create new departament with translations
     */
    public function store(Request $request)
    {
        $departament = [];
        $result = [];
        $locale = app()->getLocale();
        
        $departament = new \App\Models\Departament();
        $departament->parent_id = $request['parent_id'];                
        $departament->save();        
        
        $departament->translateOrNew($locale)->name = $request['name'];            

//        foreach (['pl', 'en'] as $locale) {
//            $departament->translateOrNew($locale)->name = $request['name'];            
//        }

        $departament->save();
        
        $result = ['data' => $departament, 'success' => true];

        return response()->json($result);
    }
    
    /**
     * Getting workers list for each departament by departamnets ids
     * 
     * @param array $departamentsIds
     * @return array $workers
     */
    public function workersList($departamentsIds = 0)
    {      
        $workerModel = new \App\Models\User();
        
        if ($departamentsIds) {            
            $departamentsIds = explode(',', $departamentsIds);
            $allDepartamentsIdsWithChildNodes = \App\Models\Departament::whereIn("id", $departamentsIds)
                    ->orWhereIn("parent_id", $departamentsIds)->pluck('id');
            $workerDepartamentModel = new \App\Models\WorkerDepartament();            
            $workersIds = $workerDepartamentModel->getWorkersIdsByDepartamentsIds($allDepartamentsIdsWithChildNodes);            
            $workers = $workerModel::find($workersIds);            
        } else {
           $workers =  $workerModel::all();
        }

        $result = ['data' => $workers, 'success' => true];
        
        return response()->json($result);
        
    }

}

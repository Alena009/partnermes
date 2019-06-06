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
    public function departaments($id = 0, $locale = 'pl')
    {
        app()->setLocale($locale);

        if ($id) {
            $departaments = \App\Models\Departament::find($id);
        } else {
            $departaments = \App\Models\Departament::all();
        }
        //$departaments = $this->index();
        
        return response()->json($departaments);
    }
    
    /**
     * create new departament with translations
     */
    public function store(Request $request)
    {
        $departament = new \App\Models\Departament();
        $departament->parent_id = $request['parent_id'];                
        $departament->save();        

        foreach (['pl', 'en'] as $locale) {
            $departament->translateOrNew($locale)->name = $request[$locale];            
        }

        $departament->save();

        return response()->json($departament);
    }
    
    /**
     * Get list of departaments for tree view on front-end
     * 
     * @return json 
     */
    public function departamentsTree()
    {
        $Departaments = $this->repository->getDepartamentsRootNodes();     
        
        foreach ($Departaments as $Departament) {             
            $kids = array();
            if(count($Departament->kids)) {                
                $kids = $this->kidTree($Departament);
            } 
            $item = [
                'items' => $kids, 
                'id' => $Departament['id'], 
                'text' => $Departament['name'], 
                'value' => $Departament['id']
            ];
            $tree[] = $item;
        }              
        
        $result = ['data' => $tree, 'success' => true];
        
        return response()->json($result);
    }
    
    /**
     * Get list of child departaments for departament-parent
     * 
     * @param object $Departament
     * @return array of kids
     */
    public function kidTree($Departament)
    {
        $kids = [];  
        $kid = [];
        
        foreach ($Departament->kids as $arr) {
            $kid = [                     
                    'id' => $arr['id'], 
                    'text' => $arr['name'], 
                    'value' => $arr['id']
                ];                
            
            if (count($arr->kids)) {                   
                $kid['items'] = $this->kidTree($arr);
            }      
            
            $kids[] = $kid;
        }
        
        return $kids;
    }
    
    /**
     * Getting workers list for each departament by departamnets ids
     * @param array $departamentsIds
     * @return array $workers
     */
    public function workersList($departamentsIds = 0)
    {      
        $workerModel = new \App\Models\User();
        
        if ($departamentsIds) {            
            $departamentsIds = explode(',', $departamentsIds);
            $workerDepartament = new \App\Models\WorkerDepartament();
            //getting array of users ids from workers-departaments table
            $workersIds = $workerDepartament::whereIn('departament_id', $departamentsIds)->pluck('user_id');
            //getting workers from directory       
            $workers = $workerModel::find($workersIds);            
        } else {
           $workers =  $workerModel::all();
        }

        $result = ['data' => $workers, 'success' => true];
        
        return response()->json($result);
        
    }
}

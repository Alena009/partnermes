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
        foreach ($Departament->kids as $arr) {
            if (count($arr->kids)) {
                $kids['items'][] = $this->kidView($arr);
            } else {
                $kids[]['text'] = $arr->name;
            }
        }
        
        return $kids;
    }
    
    public function workersList($departamentsIds = 0)
    {      
        $workerModel = new \App\Models\User();
//        $Departaments = $this->repository->getDepartamentsByIds($departamentsIds);
//                
//        foreach ($Departaments as $Departament) {
//            $workers[] = $Departament->workers;          
//        }
//        
//        return $workers;
        if ($departamentsIds) {
            $departamentsIds = explode(',', $departamentsIds);
            $workerDepartament = new \App\Models\WorkerDepartament();
            $workersIds = $workerDepartament::whereIn('departament_id', $departamentsIds)->pluck('user_id');
                   
            $workers = $workerModel::find($workersIds);            
        } else {
           $workers =  $workerModel::all();
        }

        $result = ['data' => $workers, 'success' => true];
        
        return response()->json($result);
        
    }
}

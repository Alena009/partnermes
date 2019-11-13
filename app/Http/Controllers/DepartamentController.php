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
     * get departaments list with translations
     */
    public function index($locale = 'pl')
    {
        $result = [];
        $departaments = [];        
        
        app()->setLocale($locale);

        $departaments = Departament::all();
        
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
        $locale = app()->getLocale();
        
        $departament = new Departament();
        if ($request['parent_id']) {
            $departament->parent_id = $request['parent_id'];        
        } 
        $departament->save();        
        
        $departament->translateOrNew($locale)->name = $request['name'];            

//        foreach (['pl', 'en'] as $locale) {
//            $departament->translateOrNew($locale)->name = $request['name'];            
//        }

        $departament->save();              

        return $this->getResponseResult($departament);
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
    
    public function buildScheduler()
    {  
        $departaments = [];        
        $departaments = Departament::where('parent_id', '=', null)->get();
        
        foreach ($departaments as $dep) {
            $dep->key      = $dep->id;
            $dep->label    = $dep->name;
            $dep->children = $this->kids($dep);
            $dep->open     = true;            
        }
        
        return $this->getResponseResult($departaments);
    }
    
    public function kids($departament) 
    {
        $kids = [];
        
        if (count($departament->kids)) {
            $kids = $departament->kids;
            foreach ($kids as $kid) {
                $kid->key      = $kid->id * 1000;
                $kid->label    = $kid->name;
                $kid->children = $this->kids($kid);
                $kid->open     = true;
            }
        } else {
            $kids = $departament->workers;
            foreach ($kids as $kid) {
                $kid->key      = $kid->id;
                $kid->label    = $kid->name;               
            }
        }
        
        return $kids;
    }
   
}

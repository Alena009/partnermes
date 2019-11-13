<?php

namespace App\Http\Controllers;

//use App\TaskGroup;
use Illuminate\Http\Request;

use App\Repositories\TaskGroupRepository;
use App\Models\TaskGroup;

class TaskGroupController extends BaseController
{
    private $rep;
    
    public function __construct(TaskGroupRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get tasksk groups list with translations
     */
    public function index($locale = 'pl')
    {
        $taskGroups = [];
        app()->setLocale($locale);

        $taskGroups = \App\Models\TaskGroup::all();
        
        foreach ($taskGroups as $group) {
            $group->text = $group->name;  
            $group->value = (string)$group->id;           
        }
        
        return response()->json(['success' => true, 'data' => $taskGroups]);        
    }   
    
    /**
     * create new departament with translations
     */
    public function store(Request $request)
    {
        $taskGroup = [];
        $locale = app()->getLocale();
        
        $taskGroup = new \App\Models\TaskGroup();                        
        if ($request['parent_id']) {
            $taskGroup->parent_id = $request['parent_id'];        
        } 
        $taskGroup->save();
        

        //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
        $taskGroup->translateOrNew($locale)->name = $request['name'];                        
        //}

        $taskGroup->save();

        return $this->getResponseResult($taskGroup);
    }     
}

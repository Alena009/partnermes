<?php

namespace App\Http\Controllers;

//use App\TaskGroup;
use Illuminate\Http\Request;

use App\Repositories\TaskGroupRepository;

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
        app()->setLocale($locale);

        $taskgroups = \App\Models\TaskGroup::all();
        
        foreach ($taskgroups as $group) {
            $group->text = $group->name;  
            $group->value = (string)$group->id;           
        }
        
        return response()->json(['success' => true, 'data' => $taskgroups]);        
    }   
    
    /**
     * create new departament with translations
     */
    public function store(Request $request)
    {
        $task_group = [];
        $result = [];
        $locale = app()->getLocale();
        
        $task_group = new \App\Models\TaskGroup();                
        $task_group->parent_id = $request['parent_id']; 
        $task_group->save();

        //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
        $task_group->translateOrNew($locale)->name = $request['name'];                        
        //}

        $task_group->save();

        $result = ['data' => $task_group, 'success' => true];

        return response()->json($result);
    }    
}

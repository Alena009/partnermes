<?php

namespace App\Http\Controllers;

//use App\TaskGroup;
use Illuminate\Http\Request;

use App\Repositories\TaskGroupRepository;

class TaskGroupController extends BaseController
{
    private $rep = TaskGroupRepository;
    
    public function __construct(TaskGroupRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get tasksk groups list with translations
     */
    public function taskgroups($locale = 'pl')
    {
        app()->setLocale($locale);

        $taskgroups = \App\Models\TaskGroup::all();
        
        return response()->json($taskgroups);        
    }   
    
    /**
     * create new departament with translations
     */
    public function create(Request $request)
    {
        $task_group = new \App\Models\TaskGroup();        
        $task_group->name = $request['name'];        
        $task_group->parent_id = $request['parent_id']; 
        $task_group->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $task_group->translateOrNew($locale)->name = "Title {$locale}";                        
        }

        $task_group->save();

        return true;
    }       
}

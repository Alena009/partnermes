<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\TaskRepository;
use App\Models\Task;

class TaskController extends BaseController
{
    private $rep;
    
    public function __construct(TaskRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get tasks list with translations
     */
    public function index($locale = 'pl')
    {
        $result = [];
        
        app()->setLocale($locale);
        
        $result = Task::all(); 
        
        foreach ($result as $task) {
            $task->text  = $task->name;  
            $task->value = (string)$task->id;
            $task->key   = $task->id;
            $task->label = $task->name;
        }        
        
        return response()->json(['success' => true, 'data' => $result]);        
    }

    /**
     * create new task with translations
     */
    public function store(Request $request)
    {
        $success = false;
        
        $task = new Task();
        $task->kod = $request['kod'];           
        $task->for_order = $request['for_order']; 
        $task->amount_start = $request['amount_start'];
        $task->amount_stop = $request['amount_stop'];
        $task->task_group_id = $request['task_group_id'];
        
        if ($task->save()) {
            $task->translateOrNew('pl')->name = $request['name'];                        
            $success = $task->save();
        }              

        //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            
        //}       

        return response()->json(['success' => $success, 'data' => $task]);        
    } 
    
    /**
     * Gets list tasks by task group
     * 
     */
    public function listByGroups($groups = 0)
    {   
        $result = [];
        if ($groups) {  
            $groupsIds = explode(',', $groups);
            $result = Task::whereIn('task_group_id', $groupsIds)->get();                     
        } else {
            $result = Task::all();         
        }
        
        foreach ($result as $task) {
            $task->task_group_name = $task->group->name;
            $task->text = $task->name;  
            $task->value = (string)$task->id;           
        }         
        
        return response()->json(['success' => true, 'data' => $result]);             
    }  
        
}

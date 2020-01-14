<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\TaskRepository;
use App\Models\Task;

class TaskController extends BaseController
{    
    protected $rep;
    
    public function __construct(TaskRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get tasks list with translations
     * 
     * @param str $locale
     * @return response
     */
    public function index($locale = 'pl')
    {        
        app()->setLocale($locale);
        
        return $this->getResponseResult($this->repository->allWithAdditionals());        
    }

    /**
     * Create new task with translations
     * 
     * @param array $request
     * @return response
     */
    public function store(Request $request)
    {
        $success = false;
        
        $task                = new Task();
        $task->kod           = $request->kod;           
        $task->task_group_id = $request->task_group_id;
        $task->for_order     = $request->for_order;
        
        if ($task->save()) {
            $task->translateOrNew('pl')->name = $request->name;                        
            $success = $task->save();
        }        
        $task->task_group_name = $task->group->name;

        return response()->json(['success' => $success, 'data' => $task]);        
    } 
    
    /**
     * Create new task with translations
     * 
     * @param array $request
     * @return response
     */
    public function edit(Request $request, $id)
    {
        $task = [];
        $success = false;
        $locale = app()->getLocale();
        
        $task = parent::edit($request, $id);
        
        if ($task['success']) { 
            $task = $task['data'];
            $task->translateOrNew($locale)->name = $request['name']; 
            $success = $task->save();    
        }         

        return response()->json(['success' => $success, 'data' => $task]);        
    }     
    
    /**
     * Gets list tasks by tasks groups ids
     * 
     * @param str $groups
     * @return response 
     */
    public function listByGroups($groups = 0)
    {   
        if ($groups) {  
            $groupsIds = explode(',', $groups);
            return $this->getResponseResult($this->repository->getListTasksByGroups($groupsIds));                      
        } else {
            return $this->getResponseResult($this->repository->allWithAdditionals());                              
        }            
    }
    
    /**
     * Gets list tasks not for order
     * 
     * @param str $groups
     * @return response 
     */
    public function notForOrder()
    {   
        $tasks = Task::where("for_order", "=", 0)->pluck("id");
        if ($tasks) {  
            return response()->json(['success' => true, 
                'data' => $this->repository->getFewWithAdditionals($tasks)]);            
        } else {
            return response()->json(['success' => false, 'data' => []]); 
        }            
    }    
}

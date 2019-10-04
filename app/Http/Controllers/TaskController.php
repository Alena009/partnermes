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
        
        return $this->getResponseResult($this->getListAllTasks());        
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
     * Gets list tasks by tasks groups ids
     * 
     * @param str $groups
     * @return response 
     */
    public function listByGroups($groups = 0)
    {   
        if ($groups) {  
            $groupsIds = explode(',', $groups);
            return $this->getResponseResult($this->getListTasksByGroups($groupsIds));                      
        } else {
            return $this->getResponseResult($this->getListAllTasks());                              
        }            
    }
    
    /**
     * Gets list tasks by tasks groups ids
     * 
     * @param array $groupsIds
     * @return array 
     */    
    public function getListTasksByGroups($groupsIds)
    {
        return $this->repository->getListTasksByGroups($groupsIds);
    }
    
    /**
     * Gets list all tasks 
     * 
     * @param array $groupsIds
     * @return array 
     */     
    public function getListAllTasks()
    {
        return $this->repository->getListAllTasks();
    }
}

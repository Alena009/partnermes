<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\TaskRepository;

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
        $tasks = [];
        
        app()->setLocale($locale);
        
        $tasks = \App\Models\Task::all(); 
        
        return $tasks;        
    }
    
    /**
     * Get list tasks by groups
     */
    public function listTasks($groups = 0)
    {
        $tasks = [];
        if ($groups) {  
            $groupsIds = explode(',', $groups);
            $allgroupsIdsWithChildNodes = \App\Models\TaskGroup::whereIn("id", $groupsIds)
                    ->orWhereIn("parent_id", $groupsIds)->pluck('id');
            $tasks = \App\Models\Task::whereIn("task_group_id", $allgroupsIdsWithChildNodes)->get();                     
        } else {
            $tasks = $this->index();        
        }
        
        foreach ($tasks as $task) {
            if ($task->for_order) {
                $orderPosition = $task->orderPosition;
                $order         = $orderPosition->order; 
                $product       = $orderPosition->product;
                $task['order_kod']         = $order['kod'];
                $task['order_description'] = $order['description'];
                $task['date_delivery']     = $orderPosition['date_delivery'];
                $task['product_name']      = $product['name'];                
                $task['product_kod']       = $product['kod'];                
            } else {
                $product              = $task->product;
                $task['product_name'] = $product["name"];                
                $task['product_kod']  = $product["kod"];                  
            }
        }
        
        return response()->json(['success' => true, 'data' => $tasks]);       
      
    }

    /**
     * create new task with translations
     */
    public function store(Request $request)
    {
        $success = false;
        
        $task = new \App\Models\Task();
        $task->kod = $request['kod'];        
        //$task->name = $request['name'];        
        $task->for_order = $request['for_order']; 
        $task->amount_start = $request['amount_start'];
        $task->amount_stop = $request['amount_stop'];
        $task->task_group_id = $request['task_group_id'];
        $task->order_position_id = $request['order_position_id'];
        $task->product_id = $request['product_id'];
        
        if ($task->save()) {
            $task->translateOrNew('pl')->name = $request['name'];                        
            $success = $task->save();
        }              

        //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            
        //}       

        return response()->json(['success' => $success, 'data' => $task]);        
    } 
}

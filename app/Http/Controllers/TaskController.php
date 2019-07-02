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
        
        if ($tasks) {
            $success = true;    
        }
        
        return response()->json(['success' => $success, 'data' => $tasks]);        
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
        
        if ($task->save()) {
            $task->translateOrNew('pl')->name = $request['name'];                        
            $success = $task->save();
        }

        //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            
        //}       

        return response()->json(['success' => $success, 'data' => $task]);        
    } 
}

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
    public function tasks($locale = 'pl')
    {
        app()->setLocale($locale);

        $tasks = \App\Models\Task::all();
        
        return response()->json($tasks);        
    }

    /**
     * create new task with translations
     */
    public function create(Request $request)
    {
        $task = new \App\Models\Order();
        $task->kod = $request['kod'];        
        $task->name = $request['name'];        
        $task->for_order = $request['for_order']; 
        $task->amount_start = $request['amount_start'];
        $task->amount_stop = $request['amount_stop'];
        $task->task_group_id = $request['task_group_id'];
        $task->task_groups_id = $request['task_groups_id'];
        $task->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $task->translateOrNew($locale)->name = "Title {$locale}";                        
        }

        $task->save();

        return true;
    }    
}

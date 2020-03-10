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

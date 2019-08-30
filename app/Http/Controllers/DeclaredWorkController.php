<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\DeclaredWorkRepository;
use App\Models\DeclaredWork;
use App\Models\Task;
use DB;

class DeclaredWorkController extends BaseController
{
    private $rep;
    
    public function __construct(DeclaredWorkRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    /**
     * Get list of declared works by task group
     */
    public function listWorksByGroups($groups = 0)
    {   
        $result = [];  
        
        if ($groups) {  
            $groupsIds = explode(',', $groups);  
            $tasksByGroups = Task::whereIn('task_group_id', $groupsIds)->pluck('id');

            $result = DeclaredWork::whereIn('task_id', $tasksByGroups)                   
                    ->orderBy('id', 'desc')
                    ->get();          
            
        } else {
            $result = DeclaredWork::orderBy('id', 'desc')->get();    
        }
        
        foreach ($result as $res) {
            $orderPosition = $res->orderPosition;
            $task          = $res->task; 
            $product       = $orderPosition->product;
            
            $res['kod_zlecenia'] = $orderPosition->kod;
            $res['product_kod']  = $product->kod;
            $res['product_name'] = $product->name;
            $res['task_name']    = $task->name;
            $res['task_kod']     = $task->kod;
            $res['date_delivery']= $orderPosition->date_delivery;
            $res['key']          = $orderPosition->id;
            $res['label']        = $orderPosition->kod;
        }         
        
        return response()->json(['success' => true, 'data' => $result]);            
    }  
    
    /**
     * Get list of declared works by order position
     */
    public function listWorksForOrderPos($position)
    {   
        $result = [];          

        $result = DeclaredWork::where('order_position_id', '=', $position)->get(); 
        
        foreach ($result as $res) {            
            $task         = $res->task;
            $res['label'] = $task->name;
            $res['key']   = $task->id;
            $res['text']  = $task->name;
            $res['value'] = $task->id;            
        }         
        
        return response()->json(['success' => true, 'data' => $result]);            
    }     

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OperationRepository;
use App\Models\Operation;
use App\Models\Order;

class OperationController extends BaseController
{
    private $rep;
    
    public function __construct(OperationRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function index($locale = 'pl')
    {
        $operations = [];
        app()->setLocale($locale);
        
        $operations = Operation::all();
        
        if ($operations) {
            foreach ($operations as $operation){
                $task = $operation->task;
                $user = $operation->user;            
                //for timeline view
                $operation['text']       = $task->name;   
                $operation['task_name']  = $operation['text'];
                $operation['user_name']  = $user->name;
            }
        }
        
        return response()->json(['success' => true, 'data' => $operations]);
    }
    
    /**
     * Get list tasks by groups
     */
    public function listOperations($groups = 0)
    {
        $operations = [];
        if ($groups) {  
            $groupsIds = explode(',', $groups);          
            
            $operations = Operation::leftJoin("tasks", "tasks.id", "=", "operations.task_id")                    
                    ->whereIn("tasks.task_group_id", $groupsIds)
                    ->orderBy('operations.id', 'desc')
                    ->get(); 
        } else {
//            $operations = Operation::with(['task.group' => function ($query) {
//            $query->whereIn('task_group_id', $groupsIds);}, 'user'])->get(); 
            $operations = Operation::orderBy('operations.id', 'desc')->get();             
        }
        
//        foreach ($tasks as $task) {
//            if ($task->for_order) {
//                $orderPosition = $task->orderPosition;
//                $order         = $orderPosition->order; 
//                $product       = $orderPosition->product;
//                $task['order_kod']         = $order['kod'];
//                $task['order_description'] = $order['description'];
//                $task['date_delivery']     = $orderPosition['date_delivery'];
//                $task['product_name']      = $product['name'];                
//                $task['product_kod']       = $product['kod'];                
//            } else {
//                $product              = $task->product;
//                $task['product_name'] = $product["name"];                
//                $task['product_kod']  = $product["kod"];                  
//            }
//        }
        
        
        if ($operations) {
            foreach ($operations as $operation){
                $task          = $operation->task;
                $user          = $operation->user; 
                $orderPosition = $operation->orderPosition;
                $order         = $orderPosition->order; 
                $product       = $orderPosition->product;
                $taskKod       = $task->kod;   
                $taskName      = $task->name;   
                //for frid view
                $operation['kod']               = $taskKod;        
                $operation['name']              = $taskName;   
                $operation['product_name']      = $product->name;                
                $operation['product_kod']       = $product->kod;   
                $operation['order_kod']         = $order->kod;
                $operation['order_description'] = $order->description;                
                $operation['date_delivery']     = $orderPosition->date_delivery;                
                //for timeline view
                $operation['text'] = $taskName;                   
            }
        }        
        return response()->json(['success' => true, 'data' => $operations]);       
      
    }    
    
    public function buildGantt()
    {
        $result = [];
        $orders = [];
        $tasks  = [];
        $incr   = 1;
        
        $orders = Order::all();
        foreach($orders as $order) {
            $datetime1 = date_create($order->start_date);
            $datetime2 = date_create($order->end_date);   
            
            $date = date_create($order->start_date);
            $order->start_date = date_format($date, 'd-m-Y');
            $order->text       = $order->name;
            $order->duration   = date_diff($datetime1, $datetime2)->days;
            $order->progress   = 0;
            
            $order->order_id = $order->id;
            $order->id = $incr;
            $incr++;
        }
        
        //$tasks = 
        
        
        $result = $orders;
        
        return response()->json(['success' => true, 'data' => $result]);       
    }
       
}

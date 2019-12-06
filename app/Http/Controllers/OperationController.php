<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OperationRepository;
use App\Models\Operation;
use App\Models\Order;
use App\Models\OrderPosition;
use App\Models\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
                $task     = $operation->task;
                $taskName = $task->name;
                $user     = $operation->user;       

                $operation->user_name      = $user->name;   
                $operation->task_name      = $taskName;
                $operation->text           = $taskName; 
                $operation->kod            = $task->kod;
                if ($operation->position) {
                    $operation->order_position = $operation->position->kod;    
                } else {
                    $operation->order_position = null;
                }                
            }
        }
        
        return response()->json(['success' => true, 'data' => $operations]);
    }
    
    public function save(Request $request) 
    {  
        //search opened task for this user
        $openedOperation = Operation::where("user_id", "=", $request->user_id)
                ->where("closed", "<", 1)
                ->get();
        
        //if user hasopened task and this opened task is equal to the task from 
        //request we close this task
        if (count($openedOperation)) {
            $openedOperation = $openedOperation[0];
            if ($openedOperation->task_id == $request->task_id) {
                $openedOperation->start_date  = $openedOperation->start_date;            
                $openedOperation->end_date    = date('Y-m-d H:i:s');            
                $openedOperation->done_amount = $request->done_amount;
                $openedOperation->closed      = 1;
                try {
                    return response()->json(['success' => $openedOperation->save(), 
                        'data' => [], 'message' => "Operation closed"]); 
                } 
                catch(Exception $e) {                    
                    return response()->json(["data" => [], "success" => false, 
                        "message" => $e->getMessage()]); 
                } 
            }  else {
                return response()->json(['success' => false, 'data' => [], 
                'message' => 'This user has opened tasks and can`t '
                . 'add new task while opened tasks aren`t closed']); 
            }
        } else { 
            //if user has not opened tasks - we save task from request 
            $position = OrderPosition::find($request->order_position_id); 
            //operation has order
            if ($position) {
                $task = Task::find($request['task_id']);
                if ($task) {
                    $dateStart = date('Y-m-d H:i:s');
                    $dateEnd = date('Y-m-d H:i:s', strtotime($dateStart. ' + ' . 
                            $task->duration * $position->amount . ' minute'));                    
                    $request["start_date"] = $dateStart;
                    $request["end_date"]   = $dateEnd;

                    return parent::store($request);
                } else {
                    return response()->json(['success' => false, 'data' => [], 
                    'message' => 'This task is not declared']);                     
                }
            } else {
                //operation without order (for example cleaning)
                $request["start_date"] = date('Y-m-d H:i:s');
                $request["end_date"]   = date('Y-m-d H:i:s', 
                        strtotime(date('Y-m-d H:i:s') . ' + ' . 15 . ' minute'));
                $request["start_amount"] = 1;
                $request["done_amount"] = 1;
                
                return parent::store($request);                         
            }
        }        
    }
    

    
    public function taskchange(Request $request)
    {
        $previousOperation = DB::table('operations')
                ->where("order_position_id", "=", $request["order_position_id"])
                ->where("task_id", "=", $request["task_id"]) 
                ->orderBy('id', 'desc')
                ->first();
        if ($previousOperation) {
            $amount = $previousOperation->start_amount - $previousOperation->done_amount;
            return response()->json(['success' => true, 'data' => $amount]);
        } else {
            $position = OrderPosition::find($request["order_position_id"]);
            if ($position) {                 
                return response()->json(['success' => true, 'data' => $position->amount]);
            } else {
                return response()->json(['success' => false, 'data' => [], 
                    'message' => 'Operation was not found']);
            }
        }
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
            $datetimeStart = date_create($order->date_start);
            $datetimeEnd   = date_create($order->date_end);   

            $order->start_date = date_format(date_create($order->date_start), 'd-m-Y');
            $order->text       = $order->name;
            $order->duration   = date_diff($datetimeStart, $datetimeEnd)->days;
            //$order->declared   = $order->positions->operations->count() * $position->amount;                 
            //$order->countWorks = count($order->positions->operations);
            $order->progress   = 0;             
            $result[] = $order;
            
            $positions = $order->positions;
            foreach ($positions as $position) {
                $datetimeEnd = date_create($position->date_delivery);   
                $position->start_date = date_format(date_create($order->date_start), 'd-m-Y');
                $position->text       = $position->kod;
                $position->duration   = date_diff($datetimeStart, $datetimeEnd)->days;
                $position->countWorks = count($position->operations);
                $position->declared   = $position->product->tasks->count() * $position->amount;                 
                $position->progress   = $position->countWorks/$position->declared;
                $position->parent     = $order->id;
                $result[] = $position;                          
            }
//            $order->order_id = $order->id;
//            $order->id = $incr;
//            $incr++;
        }
  
        //$result = $orders;
        
        return response()->json(['success' => true, 'data' => $result]);       
    }
       
}

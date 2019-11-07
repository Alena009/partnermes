<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OperationRepository;
use App\Models\Operation;
use App\Models\Order;
use App\Models\OrderPosition;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

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
        $openTask = [];
        $model = $this->repository->getModel();
        //search all opened tasks for this user
        $openedTasks = $model::where("user_id", "=", $request['user_id'])
                ->where("closed", "<", 1)->get(); 
        //if we found opened tasks, we search does requested task is in opened 
        //tasks list. If it is - so we will close this task, if it is not - 
        //show message for user with text that he has another opened tasks and he must 
        //to close it before adding one more task
        if (count($openedTasks)) { 
            foreach ($openedTasks as $ot) {
                if ($ot->task_id == $request["task_id"]) {
                    $openTask = $ot;
                }                
            }
            if ($openTask) {
                $openTask->start_date   = $openTask->start_date;            
                $openTask->end_date     = date('Y-m-d H:i:s');            
                $openTask->done_amount  = $request["done_amount"];
                $openTask->closed = 1; 
                try {
                    return response()->json(['success' => $openTask->save(), 'data' => [], 
                    'message' => "Operation closed"]); 
                } 
                catch(Exception $e) {                    
                    return response()->json(["data" => [], "success" => false, 
                        "message" => $e->getMessage()]); 
                }                
            } else {
                return response()->json(['success' => false, 'data' => [], 
                'message' => 'This user has opened tasks and can`t '
                . 'add new tasks while opened tasks aren`t closed']); 
            }
        } else {
            //adding new task
            $position = [];
            $position = OrderPosition::find($request->order_position_id); 
            if ($position) {   
                $declared_works = DB::table("declared_works")
                        ->where("order_position_id", "=", $position->id)
                        ->where("task_id", "=", $request->task_id)
                        ->first();
                if ($declared_works->status == 0) {
                    $productTask = [];
                } else {
                    $productTask = DB::table("product_tasks")
                        ->where("product_id", "=", $position->product_id)
                        ->where("task_id", "=", $request->task_id)
                        ->first();                      
                }                              
                if ($productTask) { 
                    $dateStart = date('Y-m-d H:i:s');
                    $dateEnd = date('Y-m-d H:i:s', strtotime($dateStart. ' + ' . 
                            $productTask->duration * $position->amount . ' minute'));                    
                    $request["start_date"] = $dateStart;
                    $request["end_date"]   = $dateEnd;

                    return parent::store($request); 
                } else {
                    return response()->json(['success' => false, 'data' => [], 
                    'message' => 'This task is not declared for this product']);                 
                }
            } else {
                //timeout or cleaning tasks which do not have order
                $request["start_date"] = date('Y-m-d H:i:s');
                $request["end_date"]   = date('Y-m-d H:i:s', 
                        strtotime(date('Y-m-d H:i:s') . ' + ' . 15 . ' minute'));
                $request["start_amount"] = 1;
                $request["done_amount"] = 1;
                
                return parent::store($request); 
            }
        }
        
//        //search all opened tasks for this user
//        $openedTasks = Operation::where("user_id", "=", $request['user_id'])
//                ->where("closed", "<", 1)->get();
//        if (count($openedTasks)) { 
//            return response()->json(['success' => false, 'data' => [], 
//                'message' => 'This user has opened tasks and can`t '
//                . 'add new tasks while opened tasks aren`t closed']);
//        } else { 
//            $position = OrderPosition::find($request['order_position_id']);              
//            $duration = DB::table("product_tasks")
//                    ->where("product_id", "=", $position->product_id)
//                    ->where("task_id", "=", $request['task_id'])
//                    ->pluck("duration");
//            $dateStart = date('Y-m-d H:i:s');
//            $dateEnd = date('Y-m-d H:i:s', strtotime($dateStart. ' + ' . $duration[0] * $position->amount . ' minute'));
//
//            $request["done_amount"] = 0;
//            $request["start_date"] = $dateStart;
//            $request["end_date"]   = $dateEnd;
//
//            return parent::store($request);            
//        }
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

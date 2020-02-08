<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OperationRepository;
use App\Models\Operation;
use App\Models\OrderPosition;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Models\DeclaredWork;
use App\Models\Warehouse;

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
        app()->setLocale($locale);
        
        $operations = $this->repository->getAllWithAdditionals();
        
        if ($operations) {
            return response()->json(['success' => true, 'data' => $operations]);
        } else {
            return response()->json(['success' => false, 'data' => []]);
        }
    }
    
    public function store(Request $request) 
    {
        $user = User::find($request->user_id);
        //if user has opened tasks we must to close it before adding new task
        if (count($user->openedOperations)) {
            return response()->json(['success' => false, 'data' => [], 
            'message' => 'This user has opened tasks and can`t '
            . 'add new task while opened tasks aren`t closed']);            
        } else {
            //check does new task for order or it does not have order
            $position = OrderPosition::find($request->order_position_id);
            if ($position) {
                $product = $position->product;
                $task = $product->tasks()->where("tasks.id", "=", $request->task_id)->get();            
                $totalDuration = $task[0]->pivot->duration * $request->start_amount;
                $new_day_plus1 = new \DateTime(date('Y-m-d H:i:s'));
                $new_day_plus1->add(new \DateInterval('PT' . $totalDuration . 'M'));

                $id = DB::table('operations')->insertGetId([
                    'user_id' => $request->user_id, 
                    'order_position_id' => $request->order_position_id,
                    'task_id' => $request->task_id,
                    'start_amount' => $request->start_amount,
                    'done_amount' => 0,
                    'start_date' => new \DateTime(date('Y-m-d H:i:s')),
                    'end_date' => $new_day_plus1->format('Y-m-d H:i:s'),
                    'created_at' => new \DateTime(date('Y-m-d H:i:s')),
                    'updated_at' => new \DateTime(date('Y-m-d H:i:s'))
                ]);              
            } else {
                $id = DB::table('operations')->insertGetId([
                    'user_id' => $request->user_id, 
                    'task_id' => $request->task_id,
                    'start_amount' => 1,
                    'done_amount' => 1,
                    'start_date' => new \DateTime(date('Y-m-d H:i:s')),
                    'created_at' => new \DateTime(date('Y-m-d H:i:s')),
                    'updated_at' => new \DateTime(date('Y-m-d H:i:s'))
                ]);                
            }
            
            if ($id) {
                return response()->json(['success' => true, 
                    'data' => $this->repository->getWithAdditionals($id)]);
            } else {
                return response()->json(['success' => false, 'data' => []]);
            }                          
        }
    }
    
    public function edit(Request $request, $id) 
    {
        $operation = Operation::find($id);

        $operation->start_amount = $request->start_amount;        
        $operation->done_amount  = $request->done_amount;        
        $operation->end_date     = new \DateTime(date('Y-m-d H:i:s'));        
        
        if ($operation->save()) {
            $product = $operation->position->product;
            $lastTask = $product->getLastTask();
            $currentOrderIsInner = $operation->position->order->isInner();
            if ($lastTask->id == $request->task_id && $currentOrderIsInner) {                
                $warehouse = new Warehouse;
                $warehouse->product_id = $product->id;
                $warehouse->amount     = $operation->done_amount;
                if ($warehouse->save()) {
                    $operation->closed = 1;
                    $operation->save();
                }
            } else {
                $operation->closed = 1;
                $operation->save();
            }
            return response()->json(['success' => true, 'data' => Operation::find($id)]);
        } else {
            return response()->json(['success' => false, 'data' => []]);
        }
    }

    public function taskchange(Request $request)
    {
        $amount     = 0;
        $success    = true;
        $positionId = $request->order_position_id;
        $taskId     = $request->task_id;

        //if task has order
        if ($positionId) {
            $position  = OrderPosition::find($positionId);
            $currentTask = DB::table('product_tasks')->where("product_id", "=", $position->product_id)
                            ->where("task_id", "=", $taskId)->get();             
            $changedTasks = DB::table('declared_works')->where("order_position_id", "=", $positionId)
                    ->where("status", "=", 1)->pluck("task_id");
            if ($changedTasks) {
                $previousTask = DB::table('product_tasks')->where("product_id", "=", $position->product_id)
                        ->whereIn("task_id", $changedTasks)->where("priority", "<", $currentTask[0]->priority)
                        ->orderBy('priority', 'desc')->first();                
            } else {
                $previousTask = DB::table('product_tasks')->where("product_id", "=", $position->product_id)
                        ->where("priority", "<", $currentTask[0]->priority)
                        ->orderBy('priority', 'desc')->first();                   
            }
            if ($previousTask) {  
                $previousTaskAvailableAmount = $this->repository->availableAmount($positionId, $previousTask->task_id); 
                $previousTaskDoneAmount = $this->repository->getDoneAmountByTask($positionId, $previousTask->task_id); 
                $currentTaskAvailableAmount = $this->repository->availableAmount($positionId, $taskId);
                if ($previousTaskAvailableAmount) {
                    $amount = $previousTaskDoneAmount;
                } else {
                    $amount = $currentTaskAvailableAmount;
                }
            } else {
                $amount = $this->repository->availableAmount($positionId, $taskId);
            }  
        }
        
        return response()->json(['success' => $success, 'data' => $amount]);
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
            $operations = Operation::orderBy('operations.id', 'desc')->get();             
        }
        
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
}

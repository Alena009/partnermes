<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\DeclaredWorkRepository;
use App\Models\DeclaredWork;
use App\Models\Task;
use App\Models\OrderPosition;
use App\Models\Product;


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
                    ->selectRaw('*, sum(declared_amount) as declared_amount')
                    ->groupBy('kod', 'product_id', 'task_id')                    
                    ->get();       
        } else {
            $result = DeclaredWork::orderBy('id', 'desc')
                    ->selectRaw('*, sum(declared_amount) as declared_amount')
                    ->groupBy('kod', 'product_id', 'task_id')                    
                    ->get();    
        }
        
        foreach ($result as $res) {
            $orderPosition = $res->orderPosition;
            $task          = $res->task; 
            $product       = $res->product;

            $res['amount']             = $orderPosition->amount;
            $res['kod_zlecenia']       = $res->kod;
            $res['product_kod']        = $product->kod;
            $res['product_name']       = $product->name;
            $res['product_type_name']  = $product->type->name;
            $res['task_name']          = $task->name;
            $res['task_kod']           = $task->kod;
            $res['date_delivery']      = $orderPosition->date_delivery;
            $date = new \DateTime($orderPosition->date_delivery);
            $res['num_week'] = $date->format("W");             
            $res['key']                = $orderPosition->id;
            $res['label']              = $orderPosition->kod;
            $res['closed']             = 0;
        }         
        
        return response()->json(['success' => true, 'data' => $result]);            
    }  
    
    public function store(Request $request) 
    {
        $result = [];
        
        $request['kod'] = $request['order_kod'] . '-' . 
                          $request['position_kod'] . '-' . 
                          $request['product_kod'];
        $result = parent::store($request);
        
        return response()->json(['success' => (boolean)count($result), 'data' => $result]);            
    }
    
//    public function addWorksForPosition($positionId)
//    {
//        $result  = [];
//        $success = false;
//
//        $position = OrderPosition::find($positionId);
//        if ($position) {
//            $order      = $position->order;
//            $product    = $position->product;
//            $tasks      = $product->tasks;
//            $components = $product->components;
//            if ($tasks) {
//                foreach ($tasks as $task) {
//                    $declaredWork = new DeclaredWork();
//                    $declaredWork->kod               = $order->kod . '-' . $position->kod . '-' . $product->kod;
//                    $declaredWork->order_position_id = $position->id;
//                    $declaredWork->product_id        = $product->id;
//                    $declaredWork->task_id           = $task->id;
//                    $declaredWork->declared_amount   = $position->amount;
//                    $declaredWork->save();                
//                }              
//            }
//            if ($components) {
//                foreach ($components as $component) {
//                    $componentProduct = $component->product;
//                    $componentTasks   = $componentProduct->tasks;
//                    foreach ($componentTasks as $comtask) {
//                        $declaredComponentWork = new DeclaredWork();
//                        $declaredComponentWork->kod               = $order->kod . '-' . $position->kod . '-' . $componentProduct->kod;
//                        $declaredComponentWork->order_position_id = $position->id;
//                        $declaredComponentWork->product_id        = $componentProduct->id;
//                        $declaredComponentWork->task_id           = $comtask->id;
//                        $declaredComponentWork->declared_amount   = $position->amount * 
//                                $component->amount;
//                        $declaredComponentWork->save();                            
//                    }
//                }
//            } 
//            $success = true;
//            $result = $tasks;              
//        }
//
//        return response()->json(['success' => $success, 'data' => $tasks]);            
//    }
    
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
    
    /**
     * Get list of declared works by zlecenie
     */
    public function listWorksForZlecenie($declaredWorkId)
    {   
        $result        = [];
        $declaredWorks = [];
        
        $declaredWork  = DeclaredWork::find($declaredWorkId); 
        $declaredWorks = DeclaredWork::where("kod", "=", $declaredWork->kod)->get();
        
        foreach ($declaredWorks as $work) {            
            $task     = $work->task;
            $product  = $work->product;
            $position = $work->orderPosition;
            $order    = $position->order; 
                  
            $date = new \DateTime($position->date_delivery);
            $work['num_week'] = $date->format("W");             
            $work['order_kod']         = $order->kod;
            $work['position_kod']      = $position->kod;
            $work['order_position_id'] = $position->id;
            $work['product_id']        = $product->id;
            $work['task_id']           = $task->id;
            $work['task_kod']          = $task->kod;
            $work['task_name']         = $task->name;
            $work['checked']           = true;
        }    
        
        $result = $declaredWorks;
        
        return response()->json(['success' => (boolean)count($result), 'data' => $result]);            
    }    
    
    /**
     * Looking for order position and components, adding tasks for this position,
     * if this position has components then looking for components and 
     * adding tasks for each component
     * 
     * @param int $positionId
     * @return type
     */
//    public function addDeclaredWorksForOrderPosition($positionId) 
//    {
//        $result  = [];
//        $success = false;
//
//        $position = OrderPosition::find($positionId);
//        if ($position) {
//            $order      = $position->order;
//            $product    = $position->product;
//            $tasks      = $product->tasks;
//            $components = $product->components;
//            foreach ($tasks as $task) {
//                $declaredWork = new DeclaredWork();
//                $declaredWork->kod               = $order->kod . '-' . $position->kod . '-' . $product->kod;
//                $declaredWork->order_position_id = $position->id;
//                $declaredWork->product_id        = $product->id;
//                $declaredWork->task_id           = $task->id;
//                $declaredWork->declared_amount   = $position->amount;
//                $declaredWork->save();                
//            }
//            if ($components) {
//                foreach ($components as $component) {
//                    $componentProduct = $component->product;
//                    $componentTasks   = $componentProduct->tasks;
//                    foreach ($componentTasks as $comtask) {
//                        $declaredComponentWork = new DeclaredWork();
//                        $declaredComponentWork->kod               = $order->kod . '-' . $position->kod . '-' . $componentProduct->kod;
//                        $declaredComponentWork->order_position_id = $position->id;
//                        $declaredComponentWork->product_id        = $componentProduct->id;
//                        $declaredComponentWork->task_id           = $comtask->id;
//                        $declaredComponentWork->declared_amount   = $position->amount * 
//                                $component->amount;
//                        $declaredComponentWork->save();                            
//                    }
//                }
//            }
//        }
//        
//        return response()->json(['success' => $success, 'data' => $result]);            
//    }
    
//    public function addWorksForSeveralPositions($ordersPositions)
//    { 
//        $result = [];
//        $success = false;
//        
//        $positionsIds = explode(',', $ordersPositions);
//        foreach ($positionsIds as $positionId) {
//            $this->addDeclaredWorksForOrderPosition($positionId);
//        }
//        $result = DeclaredWork::whereIn("order_position_id", $positionsIds);
//        if ($result) {
//            $success = true;
//        }
//
//        return response()->json(['success' => $success, 'data' => $result]);                    
//    }    

    public function addWorksForComponent(Request $request)
    { 
        $result = [];
        $success = false;
        
        $position = OrderPosition::find($request['order_position_id']);
        $order    = $position->order;
        $product  = Product::find($request['component_id']); 
        $tasks    = $product->tasks;
        if ($tasks) {
            foreach ($tasks as $task) {        
                $declaredWork = new DeclaredWork();
                $declaredWork->kod               = $order->kod . '-' . $position->kod . '-' . $product->kod;
                $declaredWork->order_position_id = $position->id;
                $declaredWork->product_id        = $product->id;
                $declaredWork->task_id           = $task->id;
                $declaredWork->declared_amount   = $request['amount_need'];
                $declaredWork->save();
            }
            $success = true;
            $result = $tasks;
        }
        
        return response()->json(['success' => $success, 'data' => $result]);                    
    }  
    
    public function makeGeneral($works) 
    {
        $worksIds = explode(',', $works);
        $declaredWorksKods = DeclaredWork::find($worksIds)->pluck("kod");
        $declaredWorks = DeclaredWork::whereIn("kod", $declaredWorksKods)->get();
        $kod = 'T-' . idate('U');
        
        if ($declaredWorks) {           
            foreach ($declaredWorks as $work) {                                
                $work->kod = $kod;                
                $work->save();
            }
        }
        return response()->json(['success' => true, 'data' => $declaredWorks]);                    
    }
    
    public function deleteZlecenie($works)
    {         
        $declaredWorksKods = [];
        $declaredWorks = [];
        
        $worksIds = explode(',', $works);
        $declaredWorksKods = DeclaredWork::find($worksIds)->pluck("kod");
        $declaredWorks = DeclaredWork::whereIn("kod", $declaredWorksKods)->get();
        if ($declaredWorks) {           
            foreach ($declaredWorks as $work) {                                
                if (!$work->delete()) {
                        return response()->json(['success' => false, 'data' => $work]);                    
                }
            }
        }
//        if ($zlecenia) {
//            foreach ($zlecenia as $item) {
//                $zlecenieKod = $item->kod;
//                $allWorksIds = DeclaredWork::where("kod", "=", $zlecenieKod)->pluck("id");
//
//                foreach ($allWorksIds as $workId) {
//                    if (!parent::destroy($workId)) {
//                        return response()->json(['success' => false, 'data' => $work]);                    
//                    }
//                }
//            }
//        }
        return response()->json(['success' => true, 'data' => $declaredWorksKods]);                    
    }
}

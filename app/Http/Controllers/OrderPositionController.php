<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\OrderPositionRepository;

use App\Models\OrderPosition;
use App\Models\DeclaredWork;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Component;

class OrderPositionController extends BaseController
{
    protected $rep;

    public function __construct(OrderPositionRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    } 
    
    /**
     * Get orders positions list 
     * 
     * @return response
     */
    public function index()
    {
        $all = $this->repository->getAllWithAdditionals();
        
        if ($all) {
            return response()->json(['data' => $all, 'success' => true]); 
        } else {
            return response()->json(['data' => [], 'success' => false]);
        }  
    }  
    
    public function positionComponents($positionsIds, $locale="pl")
    {   
        $result = [];
        $result = DB::select(DB::raw("select if(c.component_id, c.component_id, op.product_id) as component_id, 
            sum(if(c.amount * op.amount, c.amount * op.amount, op.amount)) as amount1, 
            p.kod, op.id as order_position_id,
            if(sum(w.amount),sum(w.amount),0) as available 
            from orders_positions op
            left join components c on op.product_id = c.product_id
            left join products p on p.id = if(c.component_id, c.component_id, op.product_id)
            left join warehouse w on w.product_id = if(c.component_id, c.component_id, op.product_id)
            where op.id in (" . $positionsIds .")
            group by if(c.component_id, c.component_id, op.product_id)"));
       
        return $this->getResponseResult($result);        
    }
    
    public function positionTasks($positionsIds)
    {
        $result = [];
        $positionsIds = explode(',', $positionsIds);
        $positions    = OrderPosition::find($positionsIds);
        
        foreach ($positions as $position) {
            $product       = $position->product;
            $operations    = $position->operations;
            $tasks         = $product->tasks;
                if ($tasks) {                
                    foreach ($tasks as $task) { 
                        $task->amount      = $position->amount;
                        $task->duration    = $position->amount * $task->pivot->duration;
                        $task->key         = $task->id;
                        $task->task_id     = $task->id;
                        $task->label       = $task->name;
                        $task->done        = $operations->where("task_id", "=", $task->id)
                                ->sum("done_amount");
                        $task->countWorks  = $operations->where("task_id", "=", $task->id)
                                ->count("id");  
                        $task->status     = true;
                        $wasChangedTask   = DeclaredWork::where("order_position_id", "=", $position->id)
                            ->where("task_id", "=", $task->id)->get();
                        if (count($wasChangedTask)) {
                            //print_r($wasChangedTask);
                            $task->status   = $wasChangedTask[0]->status;
                            $task->amount   = $wasChangedTask[0]->declared_amount;
                            $task->duration = $wasChangedTask[0]->declared_amount * $task->pivot->duration;
                        }
                        $result[] = $task;
                    }                
                } 
            }  
        
        return $this->getResponseResult($result);        
    }       
    
    /**
     * Get list order positions marked as "for manufacturing"
     * 
     * @return response
     */    
    public function forManufacturing()
    {        
        return $this->getResponseResult($this->repository->getForManufacturingPositions());        
    }   
    
    /**
     * Get list order positions which have tasks and can be manufactured
     * 
     * @return response
     */    
    public function forZlecenia()
    {    
        $productsWithTasks = Product::has("tasks")->pluck("id");
        $positionsIds = OrderPosition::whereIn("product_id", $productsWithTasks)
                ->pluck("id");
        
        return $this->getResponseResult($this->repository->getFewWithAdditionals($positionsIds));        
    }      
    
    /**
     * create new order position
     */
    public function store(Request $request)
    {     
        $orderPosition = [];
        $order = [];
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request['num_week'] < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');

        $order = \App\Models\Order::find($request->order_id);
        if ($order) {
            $orderPosition                = new OrderPosition();
            $orderPosition->kod           = $order->kod . "." . $request->kod;   
            $orderPosition->order_id      = $request['order_id']; 
            $orderPosition->product_id    = $request['product_id'];
            $orderPosition->amount        = $request['amount'];
            $orderPosition->price         = $request['price'];
            $orderPosition->description   = $request['description'];
            $orderPosition->date_delivery = $date_end;

            if ($orderPosition->save()) {
                return response()->json(['data' => $this->repository->getWithAdditionals($orderPosition->id),
                    'success' => true]);
            } else {
                return response()->json(['data' => [], 'success' => false, 
                    'message' => 'Saving new position failed']);
            }  
        } else {
                return response()->json(['data' => [], 'success' => false, 
                    'message' => 'Saving new position failed. Order was not found']);
        }
    }     
    
    /**
     * Gets list of components for product in order position
     * 
     * @param int $orderPosition
     * @return json response
     */
    public function listComponentsForPosition($orderPosition)
    {
        $result  = [];
        $success = false;
        
        $position = OrderPosition::find($orderPosition);
        if ($position) {
            $product    = $position->product;
            $components = $product->components;
            if ($components) {
                $success = true;                
                foreach ($components as $component) {                    
                    $componentProduct                      = $component->product;
                    $neededAvailableOfComponent            = $component->amount * $position->amount;
                    $availableAmountOfComponentInWarehouse = Warehouse::where('product_id', '=', $componentProduct->id)
                                        ->sum('amount');                    
                    $component['component_id']     = $componentProduct->id;
                    $component['component_kod']    = $componentProduct->kod;
                    $component['component_name']   = $componentProduct->name;
                    $component['amount_need']      = $neededAvailableOfComponent;
                    $component['amount_available'] = $availableAmountOfComponentInWarehouse;
                    $component['available']        = 1;
                    $component['zlecenie']         = "";
                    if ($neededAvailableOfComponent > $availableAmountOfComponentInWarehouse) {
                        $component['available'] = 0;
                        $inProgress = DeclaredWork::where("product_id", "=", $componentProduct->id)
                                ->where("order_position_id", "=", $position->id)
                                ->distinct("kod")
                                ->pluck("kod");
                        if (count($inProgress)) {
                            $component['available'] = 2;
                            $component['zlecenie']  = $inProgress[0];
                        }
                    }                  
                }
                $result = $components;
            }
        }   
        
        return response()->json(['data' => $result, 'success' => $success]);        
    }
    
    public function listTasksForPosition($orderPosition)
    {
        $position = OrderPosition::find($orderPosition);
        //$order    = $position->order;
        $product  = $position->product;
        $tasks    = $product->tasks;
        
        if ($tasks) {
            foreach ($tasks as $task) {
                $task->text  = $task->name;
                $task->value = $task->id;
//                $res->task_id           = $res->id;
//                $res->order_kod         = $order->kod;
//                $res->order_position_id = $position->id;
//                $res->position_kod      = $position->kod;
//                $res->product_id        = $product->id;
//                $res->product_kod       = $product->kod;
//                $res->product_name      = $product->name;
//                $res->declared_amount   = $position->amount;
//                $res->checked           = true;
                $task->duration = $task->pivot->duration;
                $task->priority = $task->pivot->priority;
            }
            return response()->json(["success" => true, "data" => $tasks]);                
        } else {
            return response()->json(["success" => false, "data" => []]);                
        }         
    } 
    
    public function listTasksForPositionComponent(Request $request)
    {
        $result = [];
        
        $position         = OrderPosition::find($request['position_id']);
        $componentProduct = Product::find($request['component_id']);            
        $tasks            = $componentProduct->tasks;        
        if ($tasks) {
            foreach ($tasks as $task) {
                $task['order_kod']         = $position->order->kod; 
                $task['task_id']           = $task->id;                
                $task['position_kod']      = $position->kod;
                $task['product_name']      = $componentProduct->name;
                $task['product_kod']       = $componentProduct->kod; 
                $task['product_id']        = $componentProduct->id; 
                $task['order_position_id'] = $position->id;
                $task['declared_amount']   = $request['amount'];
                $task['checked'] = true;
            }            
            $result = $tasks;
        }                
                
        return response()->json(["success" => (boolean)count($result), "data" => $result]);                
    }       
    
    public function edit(Request $request, $id)
    {       
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request['num_week'] < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');
        
        $orderPosition                = OrderPosition::find($id);
        $orderPosition->kod           = $request['kod'];
        $orderPosition->order_id      = $request['order_id'];
        $orderPosition->product_id    = $request['product_id'];
        $orderPosition->amount        = $request['amount'];
        $orderPosition->price         = $request['price'];
        $orderPosition->description   = $request['description'];
        $orderPosition->date_delivery = $date_end;
        $orderPosition->status        = $request['status'];
        $orderPosition->date_status   = $request['date_status'];
        
        if ($orderPosition->save()) {
            return response()->json(['data' => $this->repository->getWithAdditionals($orderPosition->id),
                'success' => true]);
        } else {
            return response()->json(['data' => [], 'success' => false, 
                'message' => 'Saving new position failed']);
        }
    }
    
    public function getPositionsByOrder($orderId)
    {    
        $positions = $this->repository->getFewWithAdditionals(OrderPosition::where("order_id", "=", $orderId)->pluck("id"));
        
        if ($positions) {
            return response()->json(['data' => $positions, 'success' => true]);  
        } else {
            return response()->json(['data' => $positions, 'success' => false, 
                'message' => 'Failed']);             
        }      
    }

}

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
        return $this->getResponseResult($this->repository->getAllPositionsWithAdditionalFields());      
    }
    
    
    /**
     * Returns all components for positions by their ids
     * 
     * @return type
     */
    public function getAllComponentsForFreePositions()
    {
        $data = [];
        $positions = $this->repository->getFreePositions();
        if ($positions) {
            foreach ($positions as $position) {
                $components = $this->getComponentsForPosition($position->id);
                if ($components) {
                    foreach ($components as $component) {
                        $data[] = $component;
                    }
                }
            }
        }
        
        return $this->getResponseResult($data);
    }
    
    
    public function positionComponents($positionsIds, $locale="pl")
    {
        $result = [];
        $positionsIds = explode(',', $positionsIds);
        $positions = OrderPosition::find($positionsIds);
              
        $components = DB::table('orders_positions')
        ->join('components', 'orders_positions.product_id', '=', 'components.product_id')              
        ->whereIn("orders_positions.id", $positionsIds)
        ->select('components.component_id',    
                'orders_positions.id as order_position_id',
                DB::raw('sum(components.amount * orders_positions.amount) as amount1'))
        ->groupBy('components.component_id')
        ->get();  
        
//        //check if position does not have a components, it is mean that 
//        //position is component for itself, so we add it to the list of components
//        //with amount equal to the amount in the position
//        foreach ($positions as $position) {
//            $positionComponents = $position->product->components;
//            if (!count($positionComponents)) {
//                $components->push((object)["component_id"=>$position->product_id, "amount1"=>$position->amount]);               
//            }
//        }
                        
        if ($components) {
            foreach ($components as $component) { 
                $componentProduct = Product::find($component->component_id);
                $component->kod   = $componentProduct->kod;
                $component->name  = $componentProduct->name;
                $component->available = Warehouse::where('product_id', '=', $component->component_id)
                                    ->sum('amount');
                $component->checked   = true;
                $result[] = $component;
            }                
        }
        
        return $this->getResponseResult($result);        
    }
    
    public function positionTasks($positionsIds)
    {
        $result = [];
        $positionsIds = explode(',', $positionsIds);
        $positions    = OrderPosition::find($positionsIds);
        
        foreach ($positions as $position) {
            $product    = Product::find($position->product_id);
            $tasks      = $product->tasks;
            if ($tasks) {
                foreach ($tasks as $task) { 
                    $task->product_kod = $product->kod;
                    $task->amount      = $position->amount;
                    $task->id          = $task->pivot->id;
                    $result[] = $task;
                }                
            }
        }
        
        
//        $components = DB::table('')
//        ->join('orders_positions', 'orders_positions.product_id', '=', 'components.product_id')              
//        ->join('products', 'products.id', '=', 'components.component_id')         
//        ->join('product_translations', 'product_translations.product_id', '=', 'products.id')
//                 ->where('product_translations.locale', '=', $locale) 
//        ->whereIn("orders_positions.id", $positionsIds)
//        ->select('components.*',
//                'products.kod', 
//                'product_translations.name',               
//                DB::raw('sum(components.amount * orders_positions.amount) as amount1'))
//        ->groupBy('components.component_id')
//        ->get();  
//
//        if ($components) {
//            foreach ($components as $component) {                
//                $component->available = Warehouse::where('product_id', '=', $component->component_id)
//                                    ->sum('amount');
//                $component->checked   = true;
//                $result[] = $component;
//            }                
//        }
        
        return $this->getResponseResult($result);        
    }    
    
//    public function getComponentsForPosition($positionId)
//    {
//        $position   = $this->repository->getPositionWithAdditionalFields($positionId);
//        if ($position) {
//            $product    = $position->product;
//            $components = $product->components;
//            if ($components) {
//                foreach ($components as $component) {                    
//                    $componentProduct                      = $component->product;
//                    $neededAvailableOfComponent            = $component->amount * $position->amount;
//                    $availableAmountOfComponentInWarehouse = Warehouse::where('product_id', '=', $componentProduct->id)
//                                        ->sum('amount');                 
//                    $component['order_position_id']= $position->id;
//                    $component['component_id']     = $componentProduct->id;
//                    $component['component_kod']    = $componentProduct->kod;
//                    $component['component_name']   = $componentProduct->name;
//                    $component['amount_need']      = $neededAvailableOfComponent;
//                    $component['amount_available'] = $availableAmountOfComponentInWarehouse;
//                    $component['available']        = 1;
//                    $component['zlecenie']         = "";
//                    if ($neededAvailableOfComponent > $availableAmountOfComponentInWarehouse) {
//                        $component['available'] = 0;
//                        $inProgress = DeclaredWork::where("product_id", "=", $componentProduct->id)
//                                ->where("order_position_id", "=", $position->id)
//                                ->distinct("kod")
//                                ->pluck("kod");
//                        if (count($inProgress)) {
//                            $component['available'] = 2;
//                            $component['zlecenie']  = $inProgress[0];
//                        }
//                    }                  
//                }                
//            }
//        }
//        return $components; 
//    }
    
    
    /**
     * Get list order positions without declared tasks(zlecen)
     * 
     * @return response
     */    
    public function freePositionsList()
    {        
        
//        if ($positions) {            
//            $data = $this->repository->getResultPositionsWithAdditionalFields($positions);
//            foreach ($data as $position) {
//                $position->available = $this->isPositionAvailableForCreatingZlecenie($position);
//            }
//        }
        
        return $this->getResponseResult($this->repository->getFreePositions());        
    }   
    
    /**
     * create new order position
     */
    public function store(Request $request)
    {     
        $orderPosition = [];
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request['num_week'] < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');

        $orderPosition                = new OrderPosition();
        $orderPosition->kod           = $request['kod'];   
        $orderPosition->order_id      = $request['order_id']; 
        $orderPosition->product_id    = $request['product_id'];
        $orderPosition->amount        = $request['amount'];
        $orderPosition->price         = $request['price'];
        $orderPosition->description   = $request['description'];
        $orderPosition->date_delivery = $date_end;
        $orderPosition->save();

        return $this->getResponseResult($orderPosition);        
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
        $result = [];
        
        $position = OrderPosition::find($orderPosition);
        $order    = $position->order;
        $product  = $position->product;
        $result   = ProductController::getTasksForProduct($product->id);
        
        if ($result) {
            foreach ($result as $res) {
                $res['task_id']           = $res->id;
                $res['order_kod']         = $order->kod;
                $res['order_position_id'] = $position->id;
                $res['position_kod']      = $position->kod;
                $res['product_id']        = $product->id;
                $res['product_kod']       = $product->kod;
                $res['product_name']      = $product->name;
                $res['declared_amount']   = $position->amount;
                $res['checked']           = true;
            }
        }  
        
        return response()->json(["success" => (boolean)count($result), "data" => $result]);                
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
        if ($orderPosition->save()) {
            return response()->json(['data' => OrderPosition::find($id), 'success' => true]);                
        } else {
            return response()->json(['data' => [], 'success' => false]);                
        }                
    }
    
    public function getPositionsByOrder($orderId)
    {
        $positions = [];
        $positionsIds = OrderPosition::where("order_id", "=", $orderId)->pluck("id");
        
        return $this->getResponseResult($this->repository->
                getPositionWithAdditionalFields($positionsIds));        
    }

}

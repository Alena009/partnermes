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
        return $this->getResponseResult($this->getAllPositions());      
    }
    
    /**
     * Returns all positions with parameters 
     * which was added in the getPosition()
     * 
     * @return array
     */
    public function getAllPositions()
    {
        return $this->repository->getAllPositions();
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
    
    
    public function getComponentsForPosition($positionId)
    {
        $position   = $this->repository->getPosition($positionId);
        if ($position) {
            $product    = $position->product;
            $components = $product->components;
            if ($components) {
                foreach ($components as $component) {                    
                    $componentProduct                      = $component->product;
                    $neededAvailableOfComponent            = $component->amount * $position->amount;
                    $availableAmountOfComponentInWarehouse = Warehouse::where('product_id', '=', $componentProduct->id)
                                        ->sum('amount');                 
                    $component['order_position_id']= $position->id;
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
            }
        }
        return $components; 
    }
    
    
    public function getFreePositions()
    {
        
    }
    
    /**
     * Get list order positions without declared tasks(zlecen)
     * 
     * @return response
     */    
    public function freePositionsList()
    {
        $ordersPositions = [];
        $ordersPositionsIds = DB::select("SELECT id FROM orders_positions pos
                                            where pos.id not in 
                                            (select order_position_id from declared_works 
                                            where product_id = pos.product_id)");
        $ordersPositionsIds = array_column($ordersPositionsIds, "id");
        
        $ordersPositions = OrderPosition::find($ordersPositionsIds); 
        foreach ($ordersPositions as $position) {
            $product     = $position->product;
            $components  = $product->components;

            $position['summa']              = $position['price'] * $position['amount'];
            $position['text']               = $product->name;
            $position['value']              = $position->id;             
            $position['product_name']       = $product->name;
            $position['product_kod']        = $position->product->kod;
            $position['order_kod']          = $position->order->kod;            
            $position['order_name']         = $position->order->name;       
            $position['order_position_id']  = $position->id;      
            $position['order_position_kod'] = $position->kod;      
            $position['key']                = $position->id;
            $position['label']              = $position->kod;  
            $date = new \DateTime($position->date_delivery);
            $position['num_week'] = $date->format("W");               
            $position['available']          = 1;
            foreach ($components as $component) {
                $availableAmountOfComponentInWarehouse = Warehouse::where('product_id', '=', $component->component_id)
                                                    ->sum('amount');
                $neededAvailableOfComponent = $position->amount * $component->amount;
                if ($neededAvailableOfComponent > $availableAmountOfComponentInWarehouse) {
                    $position['available'] = 0;
                    break;
                }
            }            
        }      
        
        return response()->json(['data' => $ordersPositions, 'success' => true]);        
    }
    
    /**
     * create new order position
     */
    public function store(Request $request)
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

        $orderPosition                = new OrderPosition();
        $orderPosition->kod           = $request['kod'];   
        $orderPosition->order_id      = $request['order_id']; 
        $orderPosition->product_id    = $request['product_id'];
        $orderPosition->amount        = $request['amount'];
        $orderPosition->price         = $request['price'];
        $orderPosition->description   = $request['description'];
        $orderPosition->date_delivery = $date_end;
        $orderPosition->save();

        return response()->json(['data' => $orderPosition, 'success' => (boolean)count($orderPosition)]);        
    }     
    
    /**
     * Gets list of components for product in order position
     * 
     * @param int $orderPosition
     * @return json response
     */
//    public function listComponentsForPosition($orderPosition)
//    {
//        $result  = [];
//        $success = false;
//        
//        $position = OrderPosition::find($orderPosition);
//        if ($position) {
//            $product    = $position->product;
//            $components = $product->components;
//            if ($components) {
//                $success = true;                
//                foreach ($components as $component) {                    
//                    $componentProduct                      = $component->product;
//                    $neededAvailableOfComponent            = $component->amount * $position->amount;
//                    $availableAmountOfComponentInWarehouse = Warehouse::where('product_id', '=', $componentProduct->id)
//                                        ->sum('amount');                    
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
//                $result = $components;
//            }
//        }   
//        
//        return response()->json(['data' => $result, 'success' => $success]);        
//    }
//    
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
        
        $orderPosition                = OrderPosition::find($id);
        $orderPosition->kod           = $request['kod'];
        $orderPosition->order_id      = $request['order_id'];
        $orderPosition->product_id    = $request['product_id'];
        $orderPosition->amount        = $request['amount'];
        $orderPosition->price         = $request['price'];
        $orderPosition->description   = $request['description'];
        $orderPosition->date_delivery = $date_end;
        if ($orderPosition->save()) {
            $orderPosition = OrderPosition::find($id);
        }        
        
        return response()->json(['data' => $orderPosition, 'success' => (boolean)count($orderPosition)]);                
    }    
}

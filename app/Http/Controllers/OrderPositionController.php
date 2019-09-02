<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OrderPositionRepository;
use App\Models\OrderPosition;
use App\Models\DeclaredWork;
use App\Models\ProductTask;

class OrderPositionController extends BaseController
{
    private $rep;
    
    public function __construct(OrderPositionRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }     
    
    /**
     * Get orders list with translations
     */
    public function index()
    {
        $ordersPositions = [];        

        $ordersPositions = OrderPosition::all();       
        
        foreach ($ordersPositions as $position) {            
            $productName = $position->product->name;
            $position['text']               = $productName;
            $position['value']              = $position->id;             
            $position['product_name']       = $productName;
            $position['product_kod']        = $position->product->kod;
            $position['order_kod']          = $position->order->kod;            
            $position['order_name']         = $position->order->name;       
            $position['order_position_id']  = $position->id;      
            $position['key']                = $position->id;
            $position['label']              = $position->kod;
        }           
             
        return response()->json(['data' => $ordersPositions, 'success' => true]);        
    }   
    
    /**
     * Get list order positions without declared tasks
     * 
     * @return response
     */    
    public function freePositionsList()
    {
        $ordersPositions = [];
        
        $busyPositionsIds = DeclaredWork::all()->pluck("order_position_id");
        
        $ordersPositions = OrderPosition::whereNotIn("id", $busyPositionsIds)->get(); 
        
        foreach ($ordersPositions as $position) {            
            $productName = $position->product->name;
            $position['text']               = $productName;
            $position['value']              = $position->id;             
            $position['product_name']       = $productName;
            $position['product_kod']        = $position->product->kod;
            $position['order_kod']          = $position->order->kod;            
            $position['order_name']         = $position->order->name;       
            $position['order_position_id']  = $position->id;      
            $position['key']                = $position->id;
            $position['label']              = $position->kod;
        }         
        
        return response()->json(['data' => $ordersPositions, 'success' => true]);        
    }
    
    /**
     * create new order position
     */
    public function store(Request $request)
    {
        $orderPosition = [];
        
        $orderPosition = new OrderPosition();
        $orderPosition->kod           = $request['kod'];   
        $orderPosition->order_id      = $request['order_id']; 
        $orderPosition->product_id    = $request['product_id'];
        $orderPosition->amount        = $request['amount'];
        $orderPosition->date_delivery = $request['date_delivery'];
        
        if ($orderPosition->save()) {
            $this->fillDeclaredTasksList($orderPosition->id, $orderPosition->product_id, $orderPosition->amount);
        }

        return response()->json(['data' => $orderPosition, 'success' => true]);        
    }     
    
    /**
     * Automatic filling list of declared tasks (zlecenia) for order position
     */
    public function fillDeclaredTasksList($orderPos, $productId, $amount) 
    {       
        $availableTasks = ProductTask::where("product_id", "=", $productId)->get();
        
        foreach ($availableTasks as $task) {
            $declaredWork = new DeclaredWork();
            $declaredWork->order_position_id = $orderPos;
            $declaredWork->task_id           = $task->task_id;
            $declaredWork->declared_amount   = $amount;
            $declaredWork->save();
        }
        
        return true;
    }
           
}

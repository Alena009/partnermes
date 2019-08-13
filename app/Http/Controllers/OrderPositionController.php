<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;

use App\Repositories\OrderPositionRepository;
use App\Models\OrderPosition;
use App\Models\Product;
use App\Models\Task;
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
            $position['amount_stop']        = $position->amount;    
            $position['order_position_id']  = $position->id;                
        }           
             
        return response()->json(['data' => $ordersPositions, 'success' => true]);        
    }
    
    /**
     * Get list zlecen by task group
     */
    public function zleceniaListByGroups($groups = 0)
    {   
        $result = [];  
        
        if ($groups) {  
            $groupsIds = explode(',', $groups);  
            $tasksByGroups = Task::whereIn('task_group_id', $groupsIds)->pluck('id');

            $result = ProductTask::whereIn('task_id', $tasksByGroups)                    
                    ->leftJoin('orders_positions', 'orders_positions.product_id', '=', 'product_tasks.product_id')
                    ->orderBy('orders_positions.id', 'desc')
                    ->get();          
            
        } else {
            $result = ProductTask::orderBy('orders_positions.id', 'desc')
                    ->leftJoin('orders_positions', 'orders_positions.product_id', '=', 'product_tasks.product_id')
                    ->get();    
        }
        
        foreach ($result as $res) {
            $product = $res->product;
            $task    = $res->task; 
            
            $res['product_name']      = $product->name;
            $res['product_kod']       = $product->kod;
            $res['task_name']         = $task['name'];
        }         
        
        return response()->json(['success' => true, 'data' => $result]);            
    }    

}

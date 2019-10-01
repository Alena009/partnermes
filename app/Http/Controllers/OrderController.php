<?php

namespace App\Http\Controllers;

//use App\Order;
use Illuminate\Http\Request;

use App\Repositories\OrderRepository;
use App\Models\Order;
use App\Models\OrderHistory;
use App\Models\DeclaredWork;

class OrderController extends BaseController
{    
    private $rep;
    
    public function __construct(OrderRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get orders list with translations
     */
    public function index($locale = 'pl')
    {
        $orders = [];
        app()->setLocale($locale);

        $orders = Order::orderBy("id", "desc")->get();              
        foreach ($orders as $order) {
            $order['client_name'] = $order->client->name;
            $order['text']        = $order->kod;
            $order['value']       = $order->id;
            $date = new \DateTime($order->date_end);
            $order['num_week'] = $date->format("W");                     
        }
        
        return response()->json(['data' => $orders, 'success' => (boolean)count($orders)]);        
    }
    
//    public function ordersList($amount = 0, $locale = 'pl') 
//    {
//        $orders = [];
//        app()->setLocale($locale);
//        
//        if ($amount) {
//            $orders = \App\Models\Order::orderBy('id', 'desc')->take($amount)->get();       
//        } else {
//            $orders = \App\Models\Order::orderBy('id', 'desc')->get();       
//        }      
//        
//        foreach ($orders as $order) {
//            $order['client_name'] = $order->client->name;
//            $order['text']        = $order->kod;
//            $order['value']       = $order->id; 
//            //$order['status']      = $order->history->first->name;
//        }
//        
//        return response()->json(['data' => $orders, 'success' => true]);        
//    }

    /**
     * create new order
     */
    public function store(Request $request)
    {
        $locale = app()->getLocale();
        
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request['num_week'] < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');        
        
        $order = new Order();
        $order->kod = $request['kod'];   
        $order->client_id = $request['client_id']; 
        $order->date_start = $request['date_start'];
        $order->date_end = $date_end;
        
        if ($order->save()) {
            //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
                $order->translateOrNew($locale)->name        = $request['name'];            
                $order->translateOrNew($locale)->description = $request['description'];            
            //}
            $order->save(); 
            $order->changeStatus($order->id, 1);
        }     

        return response()->json(['data' => $order, 'success' => true]);        
    } 
    
    public function edit(Request $request, $id)
    {
        $order = [];
        $locale = app()->getLocale();
        
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request['num_week'] < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');
        
        $order             = Order::find($id);
        $order->kod        = $request['kod'];
        $order->client_id  = $request['client_id'];
        $order->date_start = $request['date_start'];
        $order->date_end   = $date_end;
        
        if ($order->save()) {
            //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
                $order->translateOrNew($locale)->name        = $request['name'];            
                $order->translateOrNew($locale)->description = $request['description'];            
            //}
            $order->save(); 
        }         
        
        return response()->json(['data' => $order, 'success' => (boolean)count($order)]);                
    }


    /**
     * Returns history of orders statuses
     * 
     * @param integer $orderId
     * @return json
     */
    public function history($orderId)
    {
        $order   = [];
        $history = [];
        
        $order   = Order::find($orderId);
        $history = $order->history; 
        foreach ($history as $item) {
            $item['name'] = $item->status->name;
            $item['description'] = $item->status->description;
        }

        return response()->json(['data' => $history, 'success' => (boolean)count($history)]);
    }
    
    public function positions($orderId)
    {
        $order     = [];
        $positions = [];
        
        $order     = \App\Models\Order::find($orderId);
        $positions = $order->positions;
        
        foreach ($positions as $position) {
            $product     = $position->product;
            $productName = $product->name;
            
            $position['product_id']   = $product['id'];
            $position['product_name'] = $productName;
            $position['text']         = $productName;
            $position['value']        = $position['id'];
            $date = new \DateTime($position->date_delivery);
            $position['num_week'] = $date->format("W");    
        }

        return response()->json(['data' => $positions, 'success' => (boolean)count($positions)]);        
    }
    
    /**
     * Gets list begun tasks for order 
     * 
     * @param type $orderId
     * @return type
     */
    public function beguntasks($orderId)
    {
        $tasks        = [];
        $order        = Order::find($orderId);
        $positions    = $order->positions;
        $positionsIds = $positions->pluck('id');
        
        $tasks = DeclaredWork::whereIn("order_position_id", $positionsIds);
                        
        return response()->json(['data' => $tasks, 'success' => (boolean)count($tasks)]);         
    }
}

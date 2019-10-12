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
            $order['num_week']    = $date->format("W");
            $order['available']   = 1;
            $tasks = $this->getTasks($order->id);
            if (count($tasks)) {
                $order['available'] = 0;
            }
        }
        
        return response()->json(['data' => $orders, 'success' => (boolean)count($orders)]);        
    }
    

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
            $order->changeStatus();
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
            $position['available']   = 1;
            $tasks = DeclaredWork::where("order_position_id", "=", $position->id)->get();
            if (count($tasks)) {
                $position['available'] = 0;
            }            
        }

        return response()->json(['data' => $positions, 'success' => (boolean)count($positions)]);        
    }
    
    public function history($orderId)
    {
        $order = [];
        $order = $this->repository->getWithAdditionals($orderId);
        $history = $order->history;
        foreach ($history as $rec) {
            $status = $rec->status;
            $rec->name = $status->name;
            $rec->description = $status->description;
        }        
        
        return $this->getResponseResult($history);
    }


    /**
     * Gets list begun tasks for order 
     * 
     * @param type $orderId
     * @return type
     */
    public function beguntasks($orderId)
    {        
        $tasks = $this->getTasks($orderId);
                        
        return response()->json(['data' => $tasks, 'success' => (boolean)count($tasks)]);         
    }
    
    public function getTasks($orderId) 
    {
        $result = [];
        $order = []; 
        $order = Order::find($orderId);
        
        if ($order) {
            $positions    = $order->positions;
            $positionsIds = $positions->pluck('id');
            $result = DeclaredWork::whereIn("order_position_id", $positionsIds)->get();
        }
        
        return $result;
    }
    
}

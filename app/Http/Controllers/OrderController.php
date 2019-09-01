<?php

namespace App\Http\Controllers;

//use App\Order;
use Illuminate\Http\Request;

use App\Repositories\OrderRepository;

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
//    public function index($locale = 'pl')
//    {
//        $orders = [];
//        app()->setLocale($locale);
//
//        $orders = \App\Models\Order::all();       
//        
//        foreach ($orders as $order) {
//            $order['client_name'] = $order->client->name;
//            $order['text']        = $order->kod;
//            $order['value']       = $order->id;             
//        }
//        
//        return response()->json(['data' => $orders, 'success' => true]);        
//    }
    
    public function ordersList($amount = 0, $locale = 'pl') 
    {
        $orders = [];
        app()->setLocale($locale);
        
        if ($amount) {
            $orders = \App\Models\Order::orderBy('id', 'desc')->take($amount)->get();;       
        } else {
            $orders = \App\Models\Order::orderBy('id', 'desc')->get();       
        }      
        
        foreach ($orders as $order) {
            $order['client_name'] = $order->client->name;
            $order['text']        = $order->kod;
            $order['value']       = $order->id;       
        }
        
        return response()->json(['data' => $orders, 'success' => true]);        
    }

    /**
     * create new departament with translations
     */
    public function store(Request $request)
    {
        $locale = app()->getLocale();
        
        $order = new \App\Models\Order();
        $order->kod = $request['kod'];   
        $order->client_id = $request['client_id']; 
        $order->date_start = $request['date_start'];
        $order->date_end = $request['date_end'];
        
        $order->save();

        //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $order->translateOrNew($locale)->name        = $request['name'];            
            $order->translateOrNew($locale)->description = $request['description'];            
        //}
            $order->save();
            
        //TO-DO: add record to the order history here

        return response()->json(['data' => $order, 'success' => true]);        
    } 
    
    /**
     * Returns history of orders statuses
     * 
     * @param integer $orderId
     * @return json
     */
    public function history($orderId)
    {
        $order = [];
        $history = [];
        
        $order = \App\Models\Order::find($orderId);
        $history = $order->history;      

        return response()->json(['data' => $history, 'success' => true]);
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
        }

        return response()->json(['data' => $positions, 'success' => true]);        
    }
}

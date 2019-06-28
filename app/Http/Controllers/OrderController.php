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
    public function index($locale = 'pl')
    {
        $result = [];
        app()->setLocale($locale);

        $orders = \App\Models\Order::all();       
        
        foreach ($orders as $order) {
            $order['client'] = $order->client;
            //$order['status'] = $order->status;
        }    
        
        $result = ['data' => $orders, 'success' => true];
        
        return response()->json($result);        
    }

    /**
     * create new departament with translations
     */
    public function create(Request $request)
    {
        $order = new \App\Models\Order();
        $order->kod = $request['kod'];        
        $order->name = $request['name'];        
        $order->client_id = $request['client_id']; 
        $order->date_start = $request['date_start'];
        $order->date_end = $request['date_end'];
        $order->description = $request['description'];
        $order->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $order->translateOrNew($locale)->name = "Title {$locale}";            
            $order->translateOrNew($locale)->description = "Title {$locale}";            
        }

        $order->save();

        return true;
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
        $order = [];
        $positions = [];
        
        $order = \App\Models\Order::find($orderId);
        $positions = $order->positions;     
        foreach ($positions as $position) {
            $product = $position->product;
            $position['product_name'] = $product->name;
        }

        return response()->json(['data' => $positions, 'success' => true]);        
    }
}

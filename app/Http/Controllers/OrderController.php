<?php

namespace App\Http\Controllers;

//use App\Order;
use Illuminate\Http\Request;

use App\Repositories\OrderRepository;

class OrderController extends BaseController
{    
    private $rep = OrderRepository;
    
    public function __construct(OrderRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get orders list with translations
     */
    public function orders($locale = 'pl')
    {
        app()->setLocale($locale);

        $orders = \App\Models\Order::all();
        
        return response()->json($orders);        
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
}

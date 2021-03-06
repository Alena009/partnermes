<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\OrderRepository;
use App\Models\Order;

class OrderController extends BaseController
{    
    private $rep;
    
    public function __construct(OrderRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * create new order
     */
    public function store(Request $request, $locale = 'pl')
    {
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request->num_week < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');  
        
        $order = new Order();
        $order->kod        = $request->kod;   
        $order->client_id  = $request->client_id?$request->client_id:0; 
        $order->date_start = $request->date_start;
        $order->date_end   = $date_end;
        
        if ($order->save()) {   
            $order->translateOrNew($locale)->description = $request['description'];            
            $order->save(); 
            $order = $this->repository->getWithAdditionals($order->id);
            $order->status()->attach(1);
            return response()->json(['data' => $order, 'success' => true]);                    
        } else {
            return response()->json(['data' => [], 'success' => false, 
                'message' => 'Saving new order false']);        
        }        
    } 
    
    public function edit(Request $request, $id, $locale = 'pl')
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
            $order->translateOrNew($locale)->description = $request['description'];            
            $order->save(); 
            $order = $this->repository->getWithAdditionals($order->id);
            
            return response()->json(['data' => $order, 'success' => true]);                    
        } else {
            return response()->json(['data' => [], 'success' => false, 
                'message' => 'Saving new order false']);        
        }              
    }
    
    public function getLastOrder()
    {        
        return $this->getResponse($this->repository->lastOrder());
    }
    
    public function closeOrder($orderId)
    {     
        $order = $this->repository->get($orderId);
        if ($order) {
            $order->status()->attach(3);
            return response()->json(['data' => $order, 'success' => true]);              
        } else {
            return response()->json(['data' => [], 'success' => false, 
                'message' => 'Order was not found']);  
        }  
    }  
}

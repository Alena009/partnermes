<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\OrderRepository;
use App\Models\Order;
use Illuminate\Support\MessageBag;

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
        app()->setLocale($locale);

        $orders = $this->repository->getModel()::orderBy("id", "desc")->get();    
        if ($orders) {
            foreach ($orders as $order) {
                $order->client_name  = $order->client->name;               
                $order->text         = $order->kod;
                $order->value        = $order->id;
                $date = new \DateTime($order->date_end);
                $order->num_week     = $date->format("W");
                $order->hasopenworks = count($order->positionsInWork());            
            }            
            return response()->json(['data' => $orders, 'success' => true]);        
        } else {
            return response()->json(['data' => [], 'success' => false, 
                'message' => 'Orders were not found']);        
        }        
    }
    
    /**
     * create new order
     */
    public function store(Request $request)
    {
        $locale = app()->getLocale();

        $validator = $request->validate([
            'kod'        => 'required|unique:orders|max:45',
            'date_start' => 'required'
        ]);
        
        if (!$validator) {
            return response()->json(['success' => false,
                'data' => [],
                'message' => $validator->errors()]);
        }   
        
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

        $validator = $request->validate([
            'kod'        => 'required|unique:orders|max:45',
            'date_start' => 'required'
        ]);
        
        if (!$validator) {
            return response()->json(['success' => false,
                'data' => [],
                'message' => $validator->errors()]);
        }          
        
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
        
        return response()->json(['data' => $order, 'success' => true]);                
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
}

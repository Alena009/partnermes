<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OrderPositionRepository;

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

        $ordersPositions = \App\Models\OrderPosition::all();       
        
        foreach ($ordersPositions as $position) {            
            $productName = $position->product->name;
            
            //for filling addNewZlecenieForm
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

}

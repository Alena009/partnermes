<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\WarehouseRepository;
use App\Services\WarehouseService;

class WarehouseController extends BaseController
{
    protected $rep;
    protected $srv;

    public function __construct(WarehouseRepository $rep, WarehouseService $srv)
    {
        parent:: __construct();
        $this->setRepository($rep);
        $this->setService($srv);
    }
    
    /**
     * Get list products by groups
     */
    public function products($groups = 0, $locale = 'pl')
    {       
        $result = $this->srv->allProductsAtWarehouse($groups = 0, $locale = 'pl');
        if ($result) {
            return response()->json(['success' => true, 'data' => $result]);         
        } else {
            return response()->json(['success' => false, 'data' => $result]);         
        }
    }     

    /**
     * Get amount of product in warehouse
     */    
    public function amountProductInWarehouse($productId)
    {
        $totalAmount = $this->repository->amountProduct($productId);
        return response()->json(['success' => true, 'data' => $totalAmount]);       
    }    
}

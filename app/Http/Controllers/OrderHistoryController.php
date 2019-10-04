<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OrderHistoryRepository;
use App\Models\OrderHistory;

class OrderHistoryController extends BaseController
{
    private $rep;
    
    public function __construct(OrderHistoryRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function index()
    {
        return $this->getResponseResult($this->repository->allWithStatuses());
    }
    
    public static function changeOrderStatus($orderId, $statusId)
    {
        $orderHistory = new OrderHistory();
        $orderHistory->order_id  = $orderId;
        $orderHistory->status_id = $statusId;
        
        return $orderHistory->save();         
    }
}

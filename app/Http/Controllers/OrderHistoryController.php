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
}

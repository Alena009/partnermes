<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OrderHistoryRepository;

class OrderHistoryController extends BaseController
{
    private $rep;
    
    public function __construct(OrderHistoryRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OperationRepository;

class OperationController extends BaseController
{
    private $rep;
    
    public function __construct(OperationRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
       
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ToolOperationRepository;

class ToolOperationController extends BaseController
{
    private $rep;
    
    public function __construct(ToolOperationRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }  
}

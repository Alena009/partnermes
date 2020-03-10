<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\StatusRepository;

class StatusController extends BaseController
{
    private $rep;
    
    public function __construct(StatusRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
}

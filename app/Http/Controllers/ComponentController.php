<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ComponentRepository;

class ComponentController extends BaseController
{
    private $rep;
    
    public function __construct(ComponentRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }  
}

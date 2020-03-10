<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ToolRepository;

class ToolController extends BaseController
{
    protected $rep;
    
    public function __construct(ToolRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }      
}

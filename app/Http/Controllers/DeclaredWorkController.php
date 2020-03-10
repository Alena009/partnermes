<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\DeclaredWorkRepository;

class DeclaredWorkController extends BaseController
{    
    protected $rep;
    
    public function __construct(DeclaredWorkRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }    
}

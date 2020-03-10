<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\PermissionRepository;

class PermissionController extends BaseController
{
    private $rep;
    
    public function __construct(PermissionRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }         
}

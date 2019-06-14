<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\UserRoleRepository;

class UserRoleController extends BaseController
{
    private $rep;
    
    public function __construct(UserRoleRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    } 
}

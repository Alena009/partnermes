<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ClientRepository;

class ClientController extends BaseController
{
    private $rep;
    
    public function __construct(ClientRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
}

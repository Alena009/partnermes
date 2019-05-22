<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\WorkersRepository;

class WorkersController extends BaseController
{
    private $rep;

    public function __construct(WorkersRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }

}

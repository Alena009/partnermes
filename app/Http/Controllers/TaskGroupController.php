<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\TaskGroupRepository;

class TaskGroupController extends BaseController
{
    private $rep;
    
    public function __construct(TaskGroupRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    } 
}

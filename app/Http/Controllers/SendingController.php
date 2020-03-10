<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\SendingRepository;

class SendingController extends BaseController
{
    protected $rep;
    
    public function __construct(SendingRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    } 
    
    public function index() 
    {
        //$locale = app()->getLocale();
        $result = $this->repository->getAllWithAdditionals();
        if ($result) {
            return response()->json(['success' => true, 'data' => $result]);  
        } else {
            return response()->json(['success' => false, 'data' => $result, 
                'message' => 'There are no products']);  
        }        
    }
}

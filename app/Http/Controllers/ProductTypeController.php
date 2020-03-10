<?php

namespace App\Http\Controllers;

use App\Repositories\ProductTypeRepository;

class ProductTypeController extends BaseController
{
    private $rep;
    
    public function __construct(ProductTypeRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    public function index($locale = 'pl')
    {
        app()->setLocale($locale);
        $data = $this->repository->getAllWithAdditionals();
                
        return response()->json(['success' => true, 'data' => $data]);        
    }  
}

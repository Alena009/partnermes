<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ToolOperationRepository;

class ToolOperationController extends BaseController
{
    private $rep;
    
    public function __construct(ToolOperationRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }  
    
    public function index($locale = 'pl')
    {        
        app()->setLocale($locale);        

        if ($result = $this->repository->getAllWithAdditionals()) {  
            return response()->json(['success' => true, 'data' => $result]);            
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'There are no tools']); 
        } 
    }  
    
    public function store(Request $request)
    {           
        $data = parent::store($request);
        
        if ($data['success']) { 
            $result = $this->repository->getWithAdditionals($data['data']['id']);
            return response()->json(['success' => true, 'data' => $result]);                      
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Operation was not save']); 
        } 
    } 
    public function edit(Request $request, $id)
    {           
        $data = parent::edit($request, $id);
        
        if ($data['success']) { 
            $result = $this->repository->getWithAdditionals($data['data']['id']);
            return response()->json(['success' => true, 'data' => $result]);                      
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Operation was not edit']); 
        } 
    } 
}

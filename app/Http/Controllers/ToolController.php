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
//    
//    public function getOperations($tools = 0)
//    {
//        $result = [];
//        if ($tools) {
//            $toolsIds = explode(',', $tools);
//            $tools = $this->repository->get($toolsIds);
//        } else {
//            $tools = $this->repository->getAll();
//        }
//        if ($tools) {
//            foreach ($tools as $tool) {
//                $operations = $tool->operations;
//                if (count($operations)) { 
//                    $result[] = $operations;
//                }
//            }
//        }   
//        if ($result) {  
//            return response()->json(['success' => true, 
//                'data' => $result]);            
//        } else {
//            return response()->json(['success' => false, 'data' => [], 
//                'message' => 'En error was occurs or there are no operations for tools']); 
//        } 
//    }
//    
//    public function addOperation(Request $request)
//    {        
//        $tool = $this->repository->get($request->tool_id);
//        if ($tool) {
//            $result = $tool->operations()->attach($request->user_id, 
//                    ['date_give' => new \DateTime(date('Y-m-d H:i:s')), 
//                     'amount_give' => $request->amount_give,
//                     'amount_return' => 0]);
//            if ($result) {                 
//                return response()->json(['success' => true, 'data' => $result]); 
//            } else {
//                return response()->json(['success' => false, 'data' => [], 
//                    'message' => 'Error! Operation was not save']); 
//            }          
//        } else {
//            return response()->json(['success' => false, 'data' => [], 
//                'message' => 'Error tool was not found']); 
//        }               
//    }
//    
//    public function editOperation(Request $request)
//    {        
//        $tool = $this->repository->get($request->tool_id);
//        if ($tool) {
//            if ($result = $tool->operations()->attach($request->user_id, 
//                    ['date_give' => new \DateTime(date('Y-m-d H:i:s')), 
//                     'amount_give' => $request->amount_give,
//                     'amount_return' => $request->amount_return])) {
//                return response()->json(['success' => true, 'data' => $result]); 
//            } else {
//                return response()->json(['success' => false, 'data' => [], 
//                    'message' => 'Error! Operation was not save']); 
//            }          
//        } else {
//            return response()->json(['success' => false, 'data' => [], 
//                'message' => 'Error tool was not found']); 
//        }               
//    }    
}

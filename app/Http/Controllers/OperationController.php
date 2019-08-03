<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OperationRepository;
use App\Models\Operation;

class OperationController extends BaseController
{
    private $rep;
    
    public function __construct(OperationRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function index($locale = 'pl')
    {
        $operations = [];
        app()->setLocale($locale);
        
        $operations = Operation::all();
        
        foreach ($operations as $operation){
            $task = $operation->task;
            $user = $operation->user;            
            
            $operation['text'] = $task->name;   
            $operation['start_date'] = $operation['date_start'];
            $operation['end_date'] = $operation['date_end'];
            $operation['user_id'] = $user->id;
            
        }
        
        return response()->json(['data' => $operations, 'success' => true]);
    }
       
}

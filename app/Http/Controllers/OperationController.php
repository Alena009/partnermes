<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\OperationRepository;
use App\Models\Operation;
use App\Models\OrderPosition;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OperationController extends BaseController
{
    private $rep;
    
    public function __construct(OperationRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function store(Request $request, $locale = 'pl') 
    {
        $user = User::find($request->user_id);
        //if user has opened tasks we must to close it before adding new task
        if (count($user->openedOperations)) {
            return response()->json(['success' => false, 'data' => [], 
            'message' => 'This user has opened tasks and can`t '
            . 'add new task while opened tasks aren`t closed']);            
        } else {
            //check does new task for order or it does not have order            
            if (!$request->not_for_order) {
                $position = OrderPosition::find($request->order_position_id);
                $task = $position->product->getTask($request->task_id);
                $taskDuration = $task->pivot->duration;
                $totalDuration = $taskDuration * $request->start_amount;
                $new_day_plus1 = new \DateTime(date('Y-m-d H:i:s'));
                $new_day_plus1->add(new \DateInterval('PT' . $totalDuration . 'M'));

                $id = DB::table('operations')->insertGetId([
                    'user_id' => $request->user_id, 
                    'order_position_id' => $request->order_position_id,
                    'task_id' => $request->task_id,
                    'start_amount' => $request->start_amount,
                    'done_amount' => 0,
                    'start_date' => new \DateTime(date('Y-m-d H:i:s')),
                    'end_date' => $new_day_plus1->format('Y-m-d H:i:s'),
                    'created_at' => new \DateTime(date('Y-m-d H:i:s')),
                    'updated_at' => new \DateTime(date('Y-m-d H:i:s'))
                ]);              
            } else {
                $id = DB::table('operations')->insertGetId([
                    'user_id' => $request->user_id, 
                    'task_id' => $request->task_id,
                    'start_amount' => 1,
                    'done_amount' => 1,
                    'start_date' => new \DateTime(date('Y-m-d H:i:s')),
                    'created_at' => new \DateTime(date('Y-m-d H:i:s')),
                    'updated_at' => new \DateTime(date('Y-m-d H:i:s'))
                ]);                
            }
            
            if ($id) {
                return response()->json(['success' => true, 
                    'data' => $this->repository->getWithAdditionals($id)]);
            } else {
                return response()->json(['success' => false, 'data' => []]);
            }                          
        }
    }
    
    public function edit(Request $request, $id, $locale = 'pl') 
    {
        $operation = Operation::find($id);

        $operation->start_amount = $request->start_amount;        
        $operation->done_amount  = $request->done_amount;        
        $operation->end_date     = new \DateTime(date('Y-m-d H:i:s'));        
        $operation->closed = 1;
        
        if ($operation->save()) {
            return response()->json(['success' => true, 'data' => Operation::find($id)]);
        } else {
            return response()->json(['success' => false, 'data' => []]);
        }
    }

    public function taskchange(Request $request)
    {
        $amount     = 1;
        $success    = true;
        $positionId = $request->order_position_id;
        $taskId     = $request->task_id;

        //if task has order
        if ($positionId) {
            $amount = OrderPosition::find($positionId)->pluck("amount");            
        }
        
        return response()->json(['success' => $success, 'data' => $amount]);
    }           
}

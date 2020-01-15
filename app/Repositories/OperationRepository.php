<?php

namespace App\Repositories;
use Illuminate\Support\Facades\DB;

class OperationRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Operation";
    }
    
    public function get($id) 
    {
        return $this->model::find($id);
    } 
    
    public function getWithAdditionals($id) 
    {
        $operation = [];
        $operation = $this->model::find($id);

        if ($operation) {
            $task     = $operation->task;
            $taskName = $task->name;
            $user     = $operation->user;  
            $position = $operation->position;
            if ($position) {
                $product  = $position->product;
                $operation->order_kod      = $position->order->kod;   
                $operation->zlecenie       = $position->kod; 
                $operation->product_kod    = $product->kod;
                $operation->product_name   = $product->name;
                $operation->order_position = $operation->position->kod;    
            }
            $operation->user_name      = $user->name;   
            $operation->task_name      = $taskName;
            $operation->text           = $taskName; 
            $operation->kod            = $task->kod;            
        }
        
        return $operation;          
    }
    
    public function getDeclredAmountByTask($positionId, $taskId) 
    {
        $amount = 0;
        $changedAmount = DB::table('declared_works')->where("order_position_id", "=", $positionId)
                                          ->where("task_id", "=", $taskId)
                                          ->where("status", "=", 1)
                                          ->pluck("declared_amount");        
        if (count($changedAmount)) {
            $amount = $changedAmount[0];
        } else {
            $orderPosition = DB::table('orders_positions')->where("id", "=", $positionId)->get();
            //echo $orderPosition;
            $amount = $orderPosition[0]->amount;
        }
        
        return $amount;
    }
    
    public function getDoneAmountByTask($positionId, $taskId) 
    {
        return DB::table('operations')->where("order_position_id", "=", $positionId)
                                                     ->where("task_id", "=", $taskId) 
                                                     ->where("closed", "=", 1)
                                                     ->sum('done_amount');        
    }
    
    public function availableAmount($positionId, $taskId) 
    { 
        $declaredAmount = $this->getDeclredAmountByTask($positionId, $taskId);
        $doneAmount = $this->getDoneAmountByTask($positionId, $taskId);
        
        return $declaredAmount - $doneAmount;        
    }
  
}

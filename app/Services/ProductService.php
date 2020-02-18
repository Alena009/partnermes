<?php

namespace App\Services;

class ProductService 
{
    
    public function addTaskToProduct($product, $request)
    {
        $result = [];
        $latestTask = $product->allTasks()->last();

        if ($latestTask) { 
            $priority = $latestTask->priority + 1;                 
        } else { $priority = 1; }
        $product->tasks()->attach($request->task_id, 
                   ['duration' => $request->duration, 
                    'priority' => $priority]);
        $result = $product->tasks()
                ->where("task_id", "=", $request->task_id)
                ->first();
        $result->duration = $result->pivot->duration;
        $result->priority = $result->pivot->priority;
        $result->product_id = $product->id;
        $result->task_id = $result->id;    
        
        return $result;
    }
    
    public function editTaskToProduct($product, $request, $taskId)
    {
        $result = [];
        $result = $product->tasks()
            ->where("product_id", "=", $product->id)
            ->where("task_id", "=", $taskId)
            ->update(['priority' => $request['priority'], 
                'duration' => $request['duration']]);        
        $result = $product->tasks()->where("task_id", "=", $taskId)->first();
        $result->duration = $result->pivot->duration;
        $result->priority = $result->pivot->priority;
        $result->product_id = $product->id;
        $result->task_id = $result->id;     
        
        return $result;
    }    
}


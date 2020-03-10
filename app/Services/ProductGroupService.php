<?php

namespace App\Services;
use Illuminate\Support\Facades\DB;

class ProductGroupService 
{    
    public function addTaskToGroup($group, $request)
    {
        $result = [];
 
        $latestTask = collect($group->allTasks())->last();            
        if ($latestTask) { $priority = $latestTask->priority + 1; } else { $priority = 1; }
        $group->tasks()->attach($request->task_id, 
                   ['duration' => $request->duration, 
                    'required' => $request->required, 
                    'priority' => $priority]);    
        $result = $group->tasks()->where("task_id", "=", $request->task_id)->get()[0];
        $result->duration = $result->pivot->duration;
        $result->priority = $result->pivot->priority;
        $result->required = $result->pivot->required;
        $result->product_group_id = $group->id;
        $result->task_id = $result->id;        
        
        return $result;
    }
    
    public function editTaskToGroup($group, $request, $taskId)
    {
        $result = [];
        DB::table('product_groups_tasks')
            ->where("product_group_id", "=", $group->id)
            ->where("task_id", "=", $taskId)
            ->update(['priority' => $request['priority'], 
                'duration' => $request['duration'],
                'required' => $request['required']]);     
        $result = $group->tasks()->where("task_id", "=", $taskId)->get()[0];
        $result->duration = $result->pivot->duration;
        $result->priority = $result->pivot->priority;
        $result->required = $result->pivot->required;
        $result->product_group_id = $group->id;
        $result->task_id = $result->id;           
        
        return $result;
    } 
}


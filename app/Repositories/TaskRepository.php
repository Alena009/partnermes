<?php

namespace App\Repositories;

class TaskRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Task";
    }
    
    public function getWithAdditionals($id)
    {        
        $task = $this->model::find($id);
        
        $task->task_group_name = $task->group->name;        
        $task->text            = $task->name;  
        $task->value           = (string)$task->id;
        $task->key             = $task->id;
        $task->label           = $task->name; 
        $task->task_kod        = $task->kod;
        $task->task_name       = $task->name;
        
        return $task;        
    }
    
    
    /**
     * Returns list tasks by selected tasks groups.
     * 
     * @param array $groupsIds
     * @return array
     */
    public function getListTasksByGroups($groupsIds)
    {
        $model = $this->model();
        $tasks = $model::whereIn('task_group_id', $groupsIds)->get(); 

        return $this->withAdditionals($tasks);       
    }
       
}

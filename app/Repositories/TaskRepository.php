<?php

namespace App\Repositories;

class TaskRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Task";
    }
    
    public function getWithAdditionals($id, $locale = 'pl')
    {        
        $task = parent::getWithAdditionals($id, $locale);
        
        $task->task_group_name = $task->group->name;  
        $task->value           = $task->id;
        $task->text            = $task->name;         
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
        $tasksIds = [];
        $tasksIds = $this->model::whereIn('task_group_id', $groupsIds)->pluck("id"); 

        return $this->getFewWithAdditionals($tasksIds);       
    }
       
}

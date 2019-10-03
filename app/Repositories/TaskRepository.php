<?php

namespace App\Repositories;

class TaskRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Task";
    }
    
    public function getTask($id)
    {
        $model = $this->model();
        $task = $model::find($id);
        
        $task->task_group_name = $task->group->name;
        $task->text            = $task->name;  
        $task->value           = (string)$task->id;
        $task->key             = $task->id;
        $task->label           = $task->name;        
        
        return $task;        
    }
    
    /**
     * Returns list of all tasks
     * 
     * @return array
     */
    public function getListAllTasks()
    {
        $model = $this->model();
        $tasks = $model::all();
        
        return $this->getResultTasksArray($tasks);                
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

        return $this->getResultTaskskArray($tasks);       
    }
    
    /**
     * Returns tasks with parameters which was added in function getTask()
     * 
     * @param array $tasks
     * @return array
     */
    public function getResultTasksArray($tasks)
    {
        $result = [];
        
        if ($tasks) {
            foreach ($tasks as $task) {
                $result[] = $this->getTask($task->id);          
            }      
        }
        
        return $result;   
    }    
}

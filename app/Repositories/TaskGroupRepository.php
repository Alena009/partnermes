<?php

namespace App\Repositories;

class TaskGroupRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\TaskGroup";
    }
    
    /**
     * Return list of groups, which are root nodes 
     * (don`t have parent nodes)
     * 
     * @return array
     */
    public function getTasksGroupsRootNodes() 
    {
        return $this->model::where('parent_id', '=', 0)->get('id', 'name');            
    }   
}

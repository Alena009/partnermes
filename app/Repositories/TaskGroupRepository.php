<?php

namespace App\Repositories;
use App\Models\Task;

class TaskGroupRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\TaskGroup";
    }
    
    public function getWithAdditionals($id, $locale = 'pl') 
    {
        $record = parent::getWithAdditionals($id);
        
        if ($record) {
            if (!$record->hasTranslation($locale)) {
                $locale = 'pl';
            }
            $record->text  = $record->translate($locale)->name;  
            $record->value = (string)$record->id;
            $record->label = $record->translate($locale)->name;
            $record->key   = $record->id;            
        }  
        
        return $record;
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
    
    public function childRecordsByGroups($groups, $locale = 'pl')
    {
        $result = [];        
        $result = Task::translatedIn($locale)
                ->whereIn('task_group_id', $groups)->get();    
        if ($result) {
            foreach ($result as $r) {
                $r->task_group_name = $r->group->name;
            }
        }
    
        return $result;
    }    
}

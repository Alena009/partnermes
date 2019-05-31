<?php

namespace App\Repositories;

class DepartamentRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Departament";
    }
    
    /**
     * Return list of departaments, which are root nodes 
     * (don`t have parent nodes)
     * 
     * @return array
     */
    public function getDepartamentsRootNodes() 
    {
        return $this->model::where('parent_id', '=', 0)->get('id', 'name');            
    }
    
    public function getDepartamentsByIds($departamentsIds)
    {
        return $this->model::find($departamentsIds);
    }
}

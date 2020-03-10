<?php

namespace App\Repositories;

class DepartamentRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Departament";
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

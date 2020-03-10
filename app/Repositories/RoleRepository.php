<?php

namespace App\Repositories;

class RoleRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Role";
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
}

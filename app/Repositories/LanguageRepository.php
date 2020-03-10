<?php

namespace App\Repositories;

class LanguageRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Language";
    }
    
    public function getWithAdditionals($id, $locale = 'pl') 
    {
        $record = parent::getWithAdditionals($id);
        
        if ($record) {
            if (!$record->hasTranslation($locale)) {
                $locale = 'pl';
            }
            $record->text  = $record->translate($locale)->short;  
            $record->value = (string)$record->id;
            $record->label = $record->translate($locale)->short;
            $record->key   = $record->id;            
        }  
        
        return $record;
    }    
}

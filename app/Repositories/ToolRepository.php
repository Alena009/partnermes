<?php

namespace App\Repositories;

class ToolRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Tool";
    }  
    
    public function get($tools)
    {
        $result = [];
        $result = $this->model::find($tools);
        return $result;        
    }
    
    public function getAll()
    {
        return $this->model::all();
    }
    
    public function getWithAdditionals($id) 
    {
        $tool = $this->get($id);
        if ($tool) {
            $tool->text  = $tool->kod;
            $tool->value = $tool->id;
            $tool->label = $tool->name;
        }
        
        return $tool;
    }
}

<?php

namespace App\Repositories;

class ToolOperationRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\ToolOperation";
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
        $operation = $this->get($id);
        if ($operation) {
            $operation->user_name = $operation->user->name;
            $operation->kod       = $operation->tool->kod;            
        }
        
        return $operation;
    }    
}

<?php

namespace App\Repositories;

class OperationRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Operation";
    }
    
    public function get($id) 
    {
        return $this->model::find($id);
    } 
  
}

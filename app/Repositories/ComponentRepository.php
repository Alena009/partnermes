<?php

namespace App\Repositories;
use App\Http\Resources\ComponentResource;

class ComponentRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Component";
    }
    
    public function getWithAdditionals($id) 
    {
        $component = $this->get($id);
        ComponentResource::withoutWrapping();        
        return new ComponentResource($component);         
    }
}

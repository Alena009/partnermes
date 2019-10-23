<?php

namespace App\Repositories;

class ProductGroupRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\ProductGroup";
    }
    
    public function get($id) 
    {
        $model = $this->getModel();
        
        return $model::find($id);
    }
}

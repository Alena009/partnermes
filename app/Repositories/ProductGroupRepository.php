<?php

namespace App\Repositories;
use App\Http\Resources\ProductGroupResource;

class ProductGroupRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\ProductGroup";
    }
    
    public function getAll() 
    {
        return $this->model::all();        
    }
    
    public function getWithAdditionals($id)
    {
        $productGroup = $this->get($id);
        ProductGroupResource::withoutWrapping();        
        return new ProductGroupResource($productGroup);      
    }   
   
}

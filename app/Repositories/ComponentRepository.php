<?php

namespace App\Repositories;

class ComponentRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Component";
    }
    
    public function getWithAdditionals($id) 
    {
        $component = $this->model::find($id);
        
        if ($component) {
            $product = $component->product;
            
            $component->kod  = $product->kod;
            $component->name = $product->name;
            $component->product_type_name  = $product->type->name;
            $component->product_group_name = $product->group->name;      
        }
        
        return $component;
    }
}

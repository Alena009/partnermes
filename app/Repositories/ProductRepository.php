<?php

namespace App\Repositories;

class ProductRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Product";
    }
    
    public function get($id)
    {
        return $this->model::find($id);
    }
    
    public function getWithAdditionals($id)
    {
        $product = [];
        $product = $this->model::find($id);

        if ($product) {
            $product->product_name       = $product->name;
            $product->product_kod        = $product->kod;
            $product->text               = $product->name;
            $product->value              = $product->id;
            $product->product_type_name  = $product->type->name;
            $product->product_group_name = $product->group->name;
        }
        
        return $product;        
    }
    
    public function getLastRecord()
    {
        return $this->model::orderBy("id", "desc")->first();
    }

}

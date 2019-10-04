<?php

namespace App\Repositories;

class WarehouseRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Warehouse";
    }
    
    public function amountProduct($productId)
    {
        $model = $this->getModel();
        return $model::where('product_id', '=', $productId)->sum('amount');
    }
}

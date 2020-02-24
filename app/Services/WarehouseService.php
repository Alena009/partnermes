<?php

namespace App\Services;
use App\Models\Warehouse;
use App\Http\Resources\WarehouseResource;

class WarehouseService 
{        
    public function reserveProduct($product, $amount)
    {     
        $model = new Warehouse;
        $model->product_id = $product->id;
        $model->reserved = $amount;
        
        return $model->save();         
    }    
    
    public function unReserveProduct($product, $amount)
    {  
        $model = new Warehouse;
        $model->product_id = $product->id;
        $model->reserved = -$amount;
        
        return $model->save();         
    } 
    
    public function addProduct($product, $amount)
    {       
        $model = new Warehouse;
        $model->product_id = $product->id;
        $model->amount = $amount;
        
        return $model->save();             
    }
    
    public function deleteProduct($product, $amount)
    {
        $model = new Warehouse;
        $model->product_id = $product->id;
        $model->amount = -$amount;
        
        return $model->save();          
    }
    
    public function allProductsAtWarehouse()
    {
        $result = [];
        $model = new Warehouse;
        $records = $model->all();
        if ($records) {
            foreach ($records as $rec) {        
                WarehouseResource::withoutWrapping();        
                $result[] = new WarehouseResource($rec);                          
            }
        }
        return $result;
    }
}


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
    
    public function allProductsAtWarehouse($groups = 0, $locale = 'pl')
    {
        $result = [];
        $model = new Warehouse;
        $records = $model->all();
        
        if ($records) {
            foreach ($records as $rec) {   
                if (!$rec->product->hasTranslation($locale) || !$rec->product->group->hasTranslation($locale)) {
                    $locale = 'pl';
                } 
                $rec->product_name = $rec->product->translate($locale)->name;                
                $rec->product_kod  = $rec->product->translate($locale)->kod;
                $rec->group_name   = $rec->product->group->translate($locale)->name;                      
                $result[] = new WarehouseResource($rec);                          
            }
        }
        return $result;
    }
}


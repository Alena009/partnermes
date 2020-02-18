<?php

namespace App\Repositories;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ComponentResource;

class ProductRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Product";
    }
        
    public function getWithAdditionals($id)
    {
        $product = $this->get($id);
        ProductResource::withoutWrapping();        
        return new ProductResource($product);      
    }
    
//    public function allProducts($locale = 'pl')
//    {
//        $result = [];
//        $result = DB::table('products')
//        ->join('product_translations', 'product_translations.product_id', '=', 'products.id')
//                 ->where('product_translations.locale', '=', $locale)
//        ->join('product_group_translations', 'product_group_translations.product_group_id', '=', 'products.product_group_id')
//                 ->where('product_group_translations.locale', '=', $locale)
//        ->join('product_type_translations', 'product_type_translations.product_type_id', '=', 'products.product_type_id')
//                 ->where('product_type_translations.locale', '=', $locale)         
//        ->select('products.*', 
//                'products.kod as text', 
//                'products.id as value', 
//                'products.kod as product_kod',                 
//                'product_translations.name', 
//                'product_translations.description',
//                'product_translations.pack', 
//                'product_group_translations.name as product_group_name',
//                'product_type_translations.name as product_type_name', 
//                'product_translations.name as product_name')
//        ->get();  
//        
//        return $result;
//    }               
//    
    
    public function getLastRecord()
    {
        return $this->model::orderBy("id", "desc")->first();
    }
           
    /**
     * Getting list components for one or several products by it`s ids.
     * 
     * @param array $productsIds
     */
    public function components($productsIds) 
    {
        $result = [];
        
        $products = $this->get($productsIds);
        if ($products) {
            foreach ($products as $product) {
                $components = $product->components;
                foreach ($components as $component) {
                    ComponentResource::withoutWrapping();        
                    $result[] = new ComponentResource($component);
                }                
            }
        } 
        
        return $result;               
    }    
    
}

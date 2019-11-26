<?php

namespace App\Repositories;
use Illuminate\Support\Facades\DB;

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
    
    public function allProducts($locale = 'pl')
    {
        $result = [];
        $result = DB::table('products')
        ->join('product_translations', 'product_translations.product_id', '=', 'products.id')
                 ->where('product_translations.locale', '=', $locale)
        ->join('product_group_translations', 'product_group_translations.product_group_id', '=', 'products.product_group_id')
                 ->where('product_group_translations.locale', '=', $locale)
        ->join('product_type_translations', 'product_type_translations.product_type_id', '=', 'products.product_type_id')
                 ->where('product_type_translations.locale', '=', $locale)         
        ->select('products.*', 
                'products.kod as text', 
                'products.id as value', 
                'products.kod as product_kod',                 
                'product_translations.name', 
                'product_translations.description',
                'product_translations.pack', 
                'product_group_translations.name as product_group_name',
                'product_type_translations.name as product_type_name', 
                'product_translations.name as product_name')
        ->get();  
        
        return $result;
    }         
    
//    public function productsByGroups($groups, $locale = 'pl')
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
//        ->whereIn('products.product_group_id', $groups)
//        ->get();  
//        
//        return $result;
//    }     
    
    public function getLastRecord()
    {
        return $this->model::orderBy("id", "desc")->first();
    }

}

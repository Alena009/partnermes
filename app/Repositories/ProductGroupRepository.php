<?php

namespace App\Repositories;
use App\Http\Resources\ProductGroupResource;
use Illuminate\Support\Facades\DB;

class ProductGroupRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\ProductGroup";
    }
    
    public function getWithAdditionals($id) 
    {
        $result = parent::getWithAdditionals($id);
        if ($result) {
            $result->text  = $result->name;
            $result->value = $result->id;
        }
        return $result;
    }
    
//    public function productsByGroups($groups, $locale = 'pl')
//    {
//        $productGroup = $this->get($id);
//        ProductGroupResource::withoutWrapping();        
//        return new ProductGroupResource($productGroup);      
//    }   
 
    
    public function productsByGroups($groups, $locale = 'pl')
    {
        $result = [];
        if ($groups) {
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
            ->whereIn('products.product_group_id', $groups)
            ->get(); 
        }
    
        return $result;
    }
}

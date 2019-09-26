<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ComponentRepository;
use App\Models\Component;
use App\Models\Warehouse;
use App\Models\OrderPosition;
use App\Models\Product;

class ComponentController extends BaseController
{
    private $rep;
    
    public function __construct(ComponentRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }  
    
    /**
     * Get list components for product by its id
     * 
     * @param int $productId
     * @return json response
     */
//    public static function components($productId) 
//    {
//        $allComponents = [];
//        $allComponentsIds = [];
//        $components = [];
//        $success = false;
//
//        $productsIds = explode(',', $productId);                           
//        $components = Component::whereIn("product_id", $productsIds)->get();     
//              
//        foreach($components as $component) {           
//            $allComponentsIds[] = $component->id;
//            if ($component->components) {
//                $allComponentsIds[] = self::recursion($component);    
//            }
//            $return = [];
//            array_walk_recursive($allComponentsIds, function($a) use (&$return) { $return[] = $a; });
//        }
//
//        print_r($return);
//        $allComponents = Component::find($return);
//        foreach ($allComponents as $component) {            
//            $product = $component->product;                        
//            $component['kod']  = $product['kod'];
//            $component['name'] = $product['name'];
//            $component['product_type_name']  = $product->type['name'];
//            $component['product_group_name'] = $product->group['name']; 
//            
//            $component['amount_available']   = Warehouse::where('product_id', '=', $component->component_id)
//                                                    ->sum('amount');
//        }
//        
//        if (count($allComponents)) {
//            $success = true;
//        }
//        
//        return $allComponents;                
//    }
    
//    public static function listComponents($productId) 
//    {
//        $success = false;
//        
//        $allComponents = self::components($productId);
//        
//        if ($allComponents) {
//            $success = true;
//        }
//        
//        return response()->json(["success" => $success, "data" => $allComponents]);                
//    }


//    protected static function recursion($component)
//    {    
//        $result = [];         
//        foreach ($component->components as $component) { 
//            $result[] = $component->id;
//            $result[] = self::recursion($component);      
//        }
//        
//        return $result;      
//    }


    public static function components($productsIds)
    {
        $components = [];
        
        $components = Component::where("product_id", '=', $productsIds)->get();         
       
        foreach($components as $component) {
            $product = $component->product;            
            $component['kod']  = $product['kod'];
            $component['name'] = $product['name'];
            $component['product_type_name']  = $product->type['name'];
            $component['product_group_name'] = $product->group['name'];
            $component['amount_available']   = Warehouse::where('product_id', '=', $component->component_id)
                                                    ->sum('amount');
        }        
        
        return $components;
    }
    
    /**
     * Get list available components for product by its id
     * 
     * @param int $productId
     * @return json response
     */
    public function listComponents($products) 
    {
        $components = [];
        $success = false;

        $productsIds = explode(',', $products);
        $components = self::components($productsIds);       
        
        if (count($components)) {
            $success = true;
        }
        
        return response()->json(["success" => $success, "data" => $components]);                
    }    
}

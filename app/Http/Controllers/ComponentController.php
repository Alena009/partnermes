<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ComponentRepository;
use App\Models\Component;

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
    public function listComponents($productId) 
    {
        $components = [];
        $success = false;
        
        $components = Component::where("product_id", "=", $productId)->get();
        foreach($components as $component) {
            $product = $component->product;            
            $component['kod']  = $product['kod'];
            $component['name'] = $product['name'];
            $component['product_type_name']  = $product->type['name'];
            $component['product_group_name'] = $product->group['name'];
        }
        
        if (count($components)) {
            $success = true;
        }
        
        return response()->json(["success" => $success, "data" => $components]);                
    }
}

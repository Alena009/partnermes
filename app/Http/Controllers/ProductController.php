<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductRepository;

class ProductController extends BaseController
{
    private $rep;
    
    public function __construct(ProductRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get products list with translations
     */
    public function index($locale = 'pl')
    {
        $products = [];
        
        app()->setLocale($locale);

        $products = \App\Models\Product::all();
        
        foreach ($products as $product) {
            $product['product_name'] = $product['name'];
            $product['product_kod'] = $product['kod'];
            $product['text'] = $product['name'];
            $product['value'] = $product['id'];
        }
        
        if ($products) {
            $success = true;
        }
        
        return response()->json(["success" => $success, "data" => $products]);        
    }

    /**
     * create new product with translations
     */
    public function create(Request $request)
    {
        $product = new \App\Models\Product();
        $product->kod = $request['kod'];        
        $product->name = $request['name'];        
        $product->product_type_id = $request['product_type_id']; 
        $product->weight = $request['weight'];
        $product->height = $request['height'];
        $product->width = $request['width'];
        $product->length = $request['length'];
        $product->pictures = $request['pictures'];
        $product->description = $request['description'];
        $product->product_group_id = $request['product_group_id'];
        $product->area = $request['area'];
        $product->pack = $request['pack'];
        $product->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $order->translateOrNew($locale)->name = "Title {$locale}";            
            $order->translateOrNew($locale)->description = "Title {$locale}";            
            $order->translateOrNew($locale)->pack = "Title {$locale}";            
        }

        $order->save();

        return true;
    }   
    
    /**
     * Get list products by groups
     */
    public function listProducts($groups = 0)
    {                  
        if ($groups) {  
            $groupsIds = explode(',', $groups);
            $allgroupsIdsWithChildNodes = \App\Models\ProductGroup::whereIn("id", $groupsIds)
                    ->orWhereIn("parent_id", $groupsIds)->pluck('id');
            $products = \App\Models\Product::whereIn("task_group_id", $allgroupsIdsWithChildNodes)->get();                     
        } else {
            $products = $this->index();        
        }
        
        return response()->json(['success' => true, 'data' => $products]);       
      
    }    
}

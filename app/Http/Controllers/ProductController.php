<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductRepository;
use App\Models\Product;
use App\Models\ProductGroup;

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

        $products = Product::all();
        
        foreach ($products as $product) {
            $product['product_name'] = $product['name'];
            $product['product_kod'] = $product['kod'];
            $product['text'] = $product['name'];
            $product['value'] = $product['id'];
            $product['product_type_name']  = $product->type['name'];
            $product['product_group_name'] = $product->group['name'];
        }
        
        if ($products) {
            $success = true;
        }
        
        return response()->json(["success" => $success, "data" => $products]);        
    }

    /**
     * create new product with translations
     */
    public function store(Request $request)
    {
        $product = [];
        $success = false;
        $locale = app()->getLocale();
        
        $product = new Product();
        $product->kod              = $request['kod'];                
        $product->product_type_id  = $request['product_type_id']; 
        $product->weight           = $request['weight'];
        $product->height           = $request['height'];
        $product->width            = $request['width'];
        $product->length           = $request['length'];
        $product->area             = $request['area'];
        $product->pictures         = $request['pictures'];        
        $product->product_group_id = $request['product_group_id'];

        $product->save();

        $product->translateOrNew($locale)->name        = $request['name']; 
        $product->translateOrNew($locale)->description = $request['description'];        
        $product->translateOrNew($locale)->pack        = $request['pack'];
        
        $product->save();
        
        if (!empty((array) $product)) {
            $success = true;
        }      

        return response()->json(['data' => $product, 'success' => $success]);
    }   
    
    /**
     * Get list products by tasks groups
     */
    public function listProductsByTaskGroup($groupsTasks = 0)
    {                  
        if ($groupsTasks) {  
            $groupsIds = explode(',', $groupsTasks);
            $allgroupsIdsWithChildNodes = ProductGroup::whereIn("id", $groupsIds)
                    ->orWhereIn("parent_id", $groupsIds)->pluck('id');
            $products = Product::whereIn("task_group_id", $allgroupsIdsWithChildNodes)->get();                     
        } else {
            $products = $this->index();        
        }
        
        return response()->json(['success' => true, 'data' => $products]);       
      
    }    
    
    /**
     * Get list products by products groups
     */
    public function listProductsByProductGroup($groupsProducts = 0)
    {   
        $products = [];
        
        if ($groupsProducts) {  
            $groupsIds = explode(',', $groupsProducts);
            $products = Product::whereIn("product_group_id", $groupsIds)->get();
        
            foreach ($products as $product) {
                $product['product_name'] = $product['name'];
                $product['product_kod'] = $product['kod'];
                $product['text'] = $product['name'];
                $product['value'] = $product['id'];
                $product['product_type_name']  = $product->type['name'];
                $product['product_group_name'] = $product->group['name'];
            }
                    
        } else {
            $products = $this->index();        
        }

        return response()->json(['success' => true, 'data' => $products]);     
    }     
}

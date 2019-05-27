<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductRepository;

class ProductController extends BaseController
{
    private $rep = ProductRepository;
    
    public function __construct(ProductRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get products list with translations
     */
    public function products($locale = 'pl')
    {
        app()->setLocale($locale);

        $products = \App\Models\Product::all();
        
        return response()->json($products);        
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
}

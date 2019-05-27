<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductTypeRepository;

class ProductTypeController extends BaseController
{
    private $rep = ProductTypeRepository;
    
    public function __construct(ProductTypeRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get product types list with translations
     */
    public function prodcutTypes($locale = 'pl')
    {
        app()->setLocale($locale);

        $productTypes = \App\Models\ProductType::all();
        
        return response()->json($productTypes);        
    }

    /**
     * create new product type with translations
     */
    public function create(Request $request)
    {
        $productType = new \App\Models\ProductType();
        $productType->name = $request['name'];        
        $productType->description = $request['description'];
        $productType->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $productType->translateOrNew($locale)->name = "Title {$locale}";            
            $productType->translateOrNew($locale)->description = "Title {$locale}";            
        }

        $productType->save();

        return true;
    }    
}

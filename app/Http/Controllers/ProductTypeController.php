<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductTypeRepository;
use App\Models\ProductType;

class ProductTypeController extends BaseController
{
    private $rep;
    
    public function __construct(ProductTypeRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get product types list with translations
     */
    public function index($locale = 'pl')
    {
        app()->setLocale($locale);

        $productTypes = ProductType::all(); 
        foreach ($productTypes as $type) {
            $type['text']  = $type->name;
            $type['value'] = $type->id;
        }
        
        return response()->json(['success' => true, 'data' => $productTypes]);        
    }

    /**
     * create new product type with translations
     */
    public function store(Request $request)
    {
        $productType = [];
        $locale = app()->getLocale();
        
        $productType = new \App\Models\ProductType();
        $productType->save();
        
        $productType->translateOrNew($locale)->name = $request['name'];            
        $productType->translateOrNew($locale)->description = $request['description'];            
        
        $productType->save();

        return $this->getResponseResult($productType);
    }    
    
    public function edit(Request $request, $id)
    {
        $productType = [];
        $locale = app()->getLocale();
        
        $productType = ProductType::find($id);
        $productType->save();
        
        $productType->translateOrNew($locale)->name = $request['name'];            
        $productType->translateOrNew($locale)->description = $request['description'];            
        
        $productType->save();

        return $this->getResponseResult($productType);
    }     
}

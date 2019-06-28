<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductGroupRepository;

class ProductGroupController extends BaseController
{
    private $rep;
    
    public function __construct(ProductGroupRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    /**
     * get products groups list with translations
     */
    public function index($locale = 'pl')
    {
        app()->setLocale($locale);

        $productsGroups = \App\Models\ProductGroup::all();
                
        return response()->json(['success' => true, 'data' => $productsGroups]);        
    }
    
    /**
     * create new product group with translations
     */
    public function store(Request $request)
    {
        $productGroup = [];
        $result = [];
        $locale = app()->getLocale();
        
        $productGroup = new \App\Models\ProductGroup();
        $productGroup->parent_id = $request['parent_id'];               
        $productGroup->save();

        //foreach (['en', 'nl', 'fr', 'de'] as $locale) {
        $productGroup->translateOrNew($locale)->name = $request['name'];             
        //}

        $productGroup->save();
        
        $result = ['data' => $productGroup, 'success' => true];

        return response()->json($result);
    }
}

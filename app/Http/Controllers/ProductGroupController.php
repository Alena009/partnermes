<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductGroupRepository;

class ProductGroupController extends Controller
{
    private $rep = ProductGroupRepository;
    
    public function __construct(ProductGroupRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    /**
     * get products groups list with translations
     */
    public function departaments($locale = 'pl')
    {
        app()->setLocale($locale);

        $productsGroups = \App\Models\ProductGroup::all();
        
        return response()->json($productsGroups);
    }
    
    /**
     * create new product group with translations
     */
    public function create(Request $request)
    {
        $productGroup = new \App\Models\ProductGroup();
        $productGroup->parent_id = $request['parent_id'];        
        $productGroup->name = $request['name'];        
        $productGroup->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $productGroup->translateOrNew($locale)->name = "Title {$locale}";            
        }

        $productGroup->save();

        return true;
    }
}

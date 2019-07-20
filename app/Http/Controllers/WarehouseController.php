<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\WarehouseRepository;

class WarehouseController extends BaseController
{
    private $rep;

    public function __construct(WarehouseRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
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
            
            $records = \App\Models\Product::whereIn("product_group_id", $allgroupsIdsWithChildNodes)->get();                     
        } else {
            $records = $this->index;        
        }
        
        foreach($records as $record) {
            $product  = $record->product;
            $record['product_name'] = $product->name;
            $record['product_kod']  = $product->kod;
            $record['group_name']   = $product->name;
        }
            
        
        return response()->json(['success' => true, 'data' => $records]);       
      
    }    
}

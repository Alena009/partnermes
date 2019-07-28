<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\WarehouseRepository;
use App\Models\Warehouse;
use App\Models\ProductGroup;

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
        $records = [];
        
        if ($groups) {  
            $arrayGroupsIds = explode(',', $groups);  
            //$choosenProductGroups = ProductGroup::whereIn('id', $arrayGroupsIds)->get();
            $groupsIds = ProductGroup::whereIn("id", $arrayGroupsIds)
                    ->orWhereIn("parent_id", $arrayGroupsIds)
                    ->pluck('id');
            //print_r($groupsIds);
            $records = Warehouse::leftJoin("products", "products.id", "=", "warehouse.product_id")
                    ->whereIn("products.product_group_id", $groupsIds)
                    ->orderBy('warehouse.id', 'desc')
                    ->get();                     
        } else {
            $records = Warehouse::orderBy('id', 'desc')->get();         
        }
        
        foreach($records as $record) {
            $product  = $record->product;
            $record['product_name']     = $product['name'];
            $record['product_kod']      = $product['kod'];
            $record['product_group_id'] = $product->group['id'];
            $record['group_name']       = $product->group['name'];
        }  
        
        return response()->json(['success' => true, 'data' => $records]);       
    }  
           
    public function func($choosenGroups) 
    {                
        $result = [];  
        
        foreach ($choosenGroups as $item) {
            $result[] = $item['id'];
            if (count($item->kids)) {
                $result[] = $this->func($item->kids);
            }
        }
        
        return $result;
    }   

    /**
     * Get count quantity of a particular product in warehouse
     */    
    public function amountProductInWarehouse($productId)
    {
        $totalAmount = Warehouse::where('product_id', '=', $productId)->sum('amount');
        return response()->json(['success' => true, 'data' => $totalAmount]);       
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\WarehouseRepository;
use App\Models\Warehouse;
use App\Models\ProductGroup;
use App\Models\Product;

class WarehouseController extends BaseController
{
    protected $rep;

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
            $groupsIds = ProductGroup::whereIn("id", $arrayGroupsIds)
                    ->orWhereIn("parent_id", $arrayGroupsIds)
                    ->pluck('id');
            $productsIds = Product::whereIn("product_group_id", $groupsIds)->pluck('id');
//            $records = Warehouse::groupBy('product_id')
//                    ->selectRaw('*, sum(amount) as amount')
//                    ->whereIn('product_id', $productsIds)
//                    ->get();     
            $records = Warehouse::select('product_id')
                    ->distinct()
                    ->whereIn('product_id', $productsIds)
                    ->get();            
        } else {
//            $records = Warehouse::groupBy('product_id')
//                    ->selectRaw('*, sum(amount) as amount')
//                    ->get();  
            $records = Warehouse::select('product_id')->distinct()->get();
        }

        foreach($records as $record) {
            $product                    = $record->product;
            $record['product_name']     = $product['name'];
            $record['product_kod']      = $product['kod'];
            $record['product_group_id'] = $product->group->id;
            $record['group_name']       = $product->group->name;
            $record["amount"]           = $this->amountProduct($product->id);
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
     * Get amount of product in warehouse
     */    
    public function amountProductInWarehouse($productId)
    {
        $totalAmount = $this->repository->amountProduct($productId);
        return response()->json(['success' => true, 'data' => $totalAmount]);       
    }
    
    public function amountProduct($productId)
    {
        return Warehouse::where('product_id', '=', $productId)->sum('amount');
    }
    
}

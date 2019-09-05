<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductTaskRepository;

use App\Models\ProductTask;

class ProductTaskController extends BaseController
{
    private $rep;
    
    public function __construct(ProductTaskRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    } 
    
    public function store(Request $request) {        
        $lastPriority = ProductTask::where("product_id", "=", $request['product_id'])
                ->orderBy("id", "desc")
                ->first();
        $request["priority"] = $lastPriority["priority"] + 1;
        
        return parent::store($request);
    }
    
    /**
     * Get list products by tasks groups
     */
    public function listTasksByProduct($productId = 0)
    {
        $result = [];
        if ($productId) {              
            $result = ProductTask::where('product_id', '=', $productId)->get();                   
        } else {
            $result = $this->index();        
        }
        
        foreach ($result as $item){
            $task    = $item->task;
            $group   = $task->group;
            $product = $item->product;
            
            $item['task_id']         = $task->id;
            $item['task_name']       = $task->name;
            $item['task_kod']        = $task->kod;
            $item['product_name']    = $product->name;
            $item['product_kod']     = $product->kod;
            $item['task_group_name'] = $group->name;
        }
        
        return response()->json(['success' => true, 'data' => $result]);           
    }
    
}

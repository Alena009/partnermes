<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductRepository;
use App\Models\Product;
use App\Models\ProductGroup;
use App\Models\Task;
use \Illuminate\Support\Facades\DB;


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
        app()->setLocale($locale);  
        return $this->getResponseResult($this->repository->allProducts($locale));                        
    }
    
//    public function bygroups($groups, $locale = "pl")
//    {
//        app()->setLocale($locale);          
//        if ($groups) {
//            $groups = explode(",", $groups);
//            return $this->getResponseResult($this->repository->productsByGroups($groups, $locale));
//        } else {
//            return $this->getResponseResult($this->repository->allProducts($locale)); 
//        }          
//    }
            
    
//    /**
//     * Get products list with translations
//     */
//    public function productsByGroups($groups, $locale = 'pl')
//    {   
//        app()->setLocale($locale);          
//        if ($groups) {
//            $groups = explode(",", $groups);
//            return $this->getResponseResult($this->repository->productsByGroups($groups, $locale));
//        } else {
//            return $this->getResponseResult($this->repository->allProducts($locale)); 
//        }                    
//    }    
//    
//    public function show(Request $request, $id, $locale = 'pl')
//    {
//        app()->setLocale($locale);
//        return $this->getResponseResult($this->repository->getWithAdditionals($id));
//    }
//
    /**
     * Create new product with translations
     */
    public function store(Request $request)
    {
        $product = [];
        $locale = app()->getLocale();
        
        $product = parent::store($request);

        if ($product['success']) { 
            $product = $product['data'];
            $product->translateOrNew($locale)->name        = $request['name']; 
            $product->translateOrNew($locale)->description = $request['description'];        
            $product->translateOrNew($locale)->pack        = $request['pack'];
            $product->save();                
            $newProduct = $this->repository->getLastRecord();            
            $product = $this->repository->getWithAdditionals($newProduct->id);
        }

        return $this->getResponseResult($product);
    }  
    
    public function edit(Request $request, $id)
    {        
        $product = [];
        $locale = app()->getLocale();
        
        $product = parent::edit($request, $id);
        
        if ($product['success']) { 
            $product = $product['data'];
            $product->translateOrNew($locale)->name        = $request['name']; 
            $product->translateOrNew($locale)->description = $request['description'];        
            $product->translateOrNew($locale)->pack        = $request['pack'];
            $product->save();    
        }

        return $this->getResponseResult($product);        
    }
//    
//    /**
//     * Delete several products by ids
//     * 
//     * @param array $ids
//     */
//    public function deleteSeveralProducts($ids)
//    {
//        $arrayIds = explode(',', $ids);      
//        return $this->getResponseResult(Product::destroy($arrayIds));       
//    }
//    
    public function getListComponents($ids)
    {
        $result= [];
        $ids = explode(",", $ids);
        $result = $this->repository->listComponents($ids);
        
        if ($result) {
            return response()->json(['success' => true, 'data' => $result]);  
        } else {
            return response()->json(['success' => false, 'data' => $result, 
                'message' => 'There is no components for this product']);  
        }      
    }
    
    public function getListTasks($ids)
    {
        $result = [];
        $ids    = explode(",", $ids);
        $result = $this->repository->listTasks($ids);
        
        if ($result) {
            return response()->json(['success' => true, 'data' => $result]);  
        } else {
            return response()->json(['success' => false, 'data' => $result, 
                'message' => 'There is no tasks for this product']);  
        }                
    }
//    
// //--------------------------------------------------------------------------   
//    
//    
//    
//    /**
//     * Get list products by tasks groups
//     */
//    public function listProductsByTaskGroup($groupsTasks = 0)
//    {     
//        $products = [];
//        
//        if ($groupsTasks) {  
//            $groupsIds = explode(',', $groupsTasks);
//            $allgroupsIdsWithChildNodes = ProductGroup::whereIn("id", $groupsIds)
//                    ->orWhereIn("parent_id", $groupsIds)->pluck('id');
//            $products = Product::whereIn("task_group_id", $allgroupsIdsWithChildNodes)->get();                     
//        } else {
//            $products = $this->index();        
//        }
//        
//        return response()->json(['success' => (boolean)$products, 'data' => $products]);  
//    }    
//    
    
    /**
     * Adding task for product throw relationships
     * 
     * @param Request $request
     * @return json response
     */
    public function addTaskForProduct(Request $request)
    {
        $product = [];
        $result = [];
              
        $product = Product::find($request->product_id);        
        if ($product) {
            $latestTask = DB::table("product_tasks")
                    ->where("product_id", "=", $product->id)
                    ->orderBy("id", "desc")->first();
            
            if ($latestTask) { $priority = $latestTask->priority + 1; } else { $priority = 1; }
            $product->tasks()->attach($request->task_id, 
                       ['duration' => $request->duration, 
                        'priority' => $priority]);
            $result = $product->tasks;
        } else {
            return response()->json(['success' => false, 
                'data' => [], 'message' => 'Product was not found']);     
        } 
        
        return response()->json(['success' => true, 'data' => $result, 
            'message' => 'Task was successfull added']);     
    }
    
    public function editTask(Request $request, $productId, $taskId)
    {
        $result = DB::table('product_tasks')
            ->where("product_id", "=", $productId)
            ->where("task_id", "=", $taskId)
            ->update(['priority' => $request['priority'], 
                'duration' => $request['duration']]);        
        
        return response()->json(['success' => (boolean)$result, 'data' => $result]);     
    }    
    
    public function changePriorityTask($productId, $sTaskId, $tTaskId)
    {        
        $product = $this->repository->get($productId);
        $tasks = $product->tasks;
        
        if ($tasks) {
            foreach ($tasks as $task) {
                if ($task->id == $sTaskId) {
                    $sTaskPriority = $task->pivot->priority;
                } elseif ($task->id == $tTaskId) {
                    $tTaskPriority = $task->pivot->priority;
                }
            }

            DB::table('product_tasks')
                ->where("product_id", "=", $productId)
                ->where("task_id", "=", $sTaskId)
                ->update(['priority' => $tTaskPriority]); 
            DB::table('product_tasks')
                ->where("product_id", "=", $productId)
                ->where("task_id", "=", $tTaskId)
                ->update(['priority' => $sTaskPriority]);              
        }      
        
        return response()->json(['success' => (boolean)$tasks, 'data' => ["targetpriority"=>$tTaskPriority,
            "sourcepriority" => $sTaskPriority]]);     
    }       
//    
//    
//    /**
//     * Gets list available tasks for adding to the list of tasks for product
//     * 
//     * @param integer $productId
//     * @return json response
//     */
//    public function listAvailableTasks($productId)
//    {
//        $product = [];
//        $result = [];
//        
//        $product = Product::find($productId);
//        if ($product) {
//            $busyTasksIds = $product->tasks->pluck("id");
//            $result = Task::whereNotIn("id", $busyTasksIds)->get();
//            
//            foreach ($result as $task) {
//                $task->text  = $task->name;  
//                $task->value = (string)$task->id;
//                $task->key   = $task->id;
//                $task->label = $task->name;
//                $task->task_kod = $task->kod;
//                $task->task_name = $task->name;
//            }            
//        }           
//
//        return response()->json(['success' => (boolean)$result, 'data' => $result]);     
//    }
//    
    public function deleteTask($productId, $taskId)
    {
        $product = $this->repository->get($productId);
        
        if ($product->tasks()->detach($taskId)) {            
            return response()->json(['success' => true, 'data' => $product->tasks]);     
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Error! Task was not deleted.']);     
        }
    }
}

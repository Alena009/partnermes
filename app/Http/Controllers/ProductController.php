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
            $latestTask = $product->allTasks();
            
            if ($latestTask) { 
                $priority = $latestTask->priority + 1;                 
            } else { $priority = 1; }
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

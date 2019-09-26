<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductRepository;
use App\Models\Product;
use App\Models\ProductGroup;
use App\Models\Task;

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
        $products = [];        
        app()->setLocale($locale);

        $products = Product::all();
        
        foreach ($products as $product) {
            $product['product_name'] = $product['name'];
            $product['product_kod'] = $product['kod'];
            $product['text'] = $product['name'];
            $product['value'] = $product['id'];
            $product['product_type_name']  = $product->type['name'];
            $product['product_group_name'] = $product->group['name'];
        }
        
        return response()->json(["success" => (boolean)$products, "data" => $products]);        
    }

    /**
     * create new product with translations
     */
    public function store(Request $request)
    {
        $product = [];
        $success = false;
        $locale = app()->getLocale();
        
        $product = new Product();
        $product->kod              = $request['kod'];                
        $product->product_type_id  = $request['product_type_id']; 
        $product->weight           = $request['weight'];
        $product->height           = $request['height'];
        $product->width            = $request['width'];
        $product->length           = $request['length'];
        $product->area             = $request['area'];
        $product->pictures         = $request['pictures'];        
        $product->product_group_id = $request['product_group_id'];

        $product->save();

        $product->translateOrNew($locale)->name        = $request['name']; 
        $product->translateOrNew($locale)->description = $request['description'];        
        $product->translateOrNew($locale)->pack        = $request['pack'];
        
        $product->save();
        
        if (!empty((array) $product)) {
            $success = true;
        }      

        return response()->json(['data' => $product, 'success' => $success]);
    }   
    
    /**
     * Get list products by tasks groups
     */
    public function listProductsByTaskGroup($groupsTasks = 0)
    {     
        $products = [];
        
        if ($groupsTasks) {  
            $groupsIds = explode(',', $groupsTasks);
            $allgroupsIdsWithChildNodes = ProductGroup::whereIn("id", $groupsIds)
                    ->orWhereIn("parent_id", $groupsIds)->pluck('id');
            $products = Product::whereIn("task_group_id", $allgroupsIdsWithChildNodes)->get();                     
        } else {
            $products = $this->index();        
        }
        
        return response()->json(['success' => (boolean)$products, 'data' => $products]);  
    }    
    
    /**
     * Get list products by products groups
     */
    public function listProductsByProductGroup($groupsProducts = 0)
    {   
        $products = [];
        
        if ($groupsProducts) {  
            $groupsIds = explode(',', $groupsProducts);
            $products = Product::whereIn("product_group_id", $groupsIds)->get();
        
            foreach ($products as $product) {
                $product['product_name'] = $product['name'];
                $product['product_kod'] = $product['kod'];
                $product['text'] = $product['name'];
                $product['value'] = $product['id'];
                $product['product_type_name']  = $product->type['name'];
                $product['product_group_name'] = $product->group['name'];
            }
                    
        } else {
            $products = $this->index();        
        }

        return response()->json(['success' => true, 'data' => $products]);     
    }    
    
    /**
     * Gets list with tasks for product by his id
     * 
     * @param integer $productId
     * @return json response
     */
    public function listTasksForProduct($productId)
    {
        $result = self::getTasksForProduct($productId);        
        return response()->json(['success' => (boolean)$result, 'data' => $result]);     
    }
    
    /**
     * Function-getter. Gets list with tasks for product by his id
     * 
     * @param integer $productId
     * @return array
     */    
    public static function getTasksForProduct($productId)
    {
        $product = [];
        $tasks = [];
        
        $product = Product::find($productId);       
        if ($product) { 
            $tasks = $product->tasks; 
            foreach ($tasks as $task) {
                $task->duration = $task->pivot->duration;
                $task->priority = $task->pivot->priority;
            }
        }
        return $tasks;        
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
        
        $product = Product::find($request['product_id']);        
        if ($product) {
            $product->tasks()->attach($request['task_id'], 
                       ['duration' => $request['duration'], 
                        'priority' => $request['priority']]);
            $result = self::getTasksForProduct($request['product_id']);
        } 
        
        return response()->json(['success' => (boolean)$result, 'data' => $result]);     
    }
    
    /**
     * Gets list available tasks for adding to the list of tasks for product
     * 
     * @param integer $productId
     * @return json response
     */
    public function listAvailableTasks($productId)
    {
        $product = [];
        $result = [];
        
        $product = Product::find($productId);
        if ($product) {
            $busyTasksIds = $product->tasks->pluck("id");
            $result = Task::whereNotIn("id", $busyTasksIds)->get();
            
            foreach ($result as $task) {
                $task->text  = $task->name;  
                $task->value = (string)$task->id;
                $task->key   = $task->id;
                $task->label = $task->name;
            }            
        }           

        return response()->json(['success' => (boolean)$result, 'data' => $result]);     
    }
    
}

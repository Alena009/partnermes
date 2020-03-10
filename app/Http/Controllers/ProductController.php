<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ProductRepository;
use App\Services\ProductService;

class ProductController extends BaseController
{
    private $rep;
    private $res;
    protected $srv;
    
    public function __construct(ProductRepository $rep, ProductService $srv)
    {
        parent:: __construct();
        $this->setRepository($rep);    
        $this->setService($srv);
    }          
    
    public function index($locale = 'pl')
    {
        app()->setLocale($locale);        
        return $this->getResponse($this->repository->allProducts($locale), '', 'There are no products');        
    }
    
    /**
     * Gets list components by productsIds
     * 
     * @param str $productsIds
     * @return json 
     */
    public function components($productsIds)
    {                
        return $this->getResponse($this->repository->components(explode(",", $productsIds)), '', 'There are no components for this product');   
    }
    
    /**
     * Gets list tasks which are not attached to this product yet
     * 
     * @param str $productId
     * @return json 
     */    
    public function freeTasks($productId)
    {
        $product = $this->repository->get($productId);
        return $this->getResponse($this->srv->getFreeTasksForProduct($product), '', 'There are no free tasks for this products');                               
    }    
    
    /**
     * Gets list tasks for product 
     * 
     * @param str $productId
     * @return json 
     */    
    public function tasks($productId)
    {
        $product = $this->repository->get($productId);
        return $this->getResponse($product->allTasks(), '', 'There is no tasks for this product');                         
    }

    /**
     * Gets list tasks for product 
     * 
     * @param str $productId
     * @return json 
     */       
    public function addTask(Request $request)
    {     
        $product = $this->repository->get($request->product_id);   
        
        if ($product) {
            $result = $this->srv->addTaskToProduct($product, $request);
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Product was not found']);     
        }         
        return response()->json(['success' => true, 'data' => $result, 
            'message' => 'Task was successfull added']);     
    }
    
    public function editTask(Request $request, $productId, $taskId)
    {
        $product = $this->repository->get($productId); 
        if ($product) {
            $result = $this->srv->editTaskToProduct($product, $request, $taskId);
        } else {
            return response()->json(['success' => false, 'data' => $result, 
                'message' => 'Product was not found']);              
        }        
        return response()->json(['success' => true, 'data' => $result, 
            'message' => 'Task was successfull updated']);      
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

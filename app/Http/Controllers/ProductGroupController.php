<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductGroupRepository;
use App\Services\ProductGroupService;

class ProductGroupController extends BaseController
{
    private $rep;
    private $res;
    protected $srv;    
    
    public function __construct(ProductGroupRepository $rep, ProductGroupService $srv)
    {
        parent:: __construct();
        $this->setRepository($rep);
        $this->setService($srv);
    }
    
    public function products($groups, $locale = 'pl')
    {            
        $result = [];
        
        if ($groups == 0) {
            $groups = $this->repository->getAll();
        } else {         
            $groups = $this->repository->get(explode(",", $groups));
        }
        
        if ($groups) {
            foreach ($groups as $group) {
                $groupKids = $group->allKids($group);
                foreach($groupKids as $kidGroup) {
                    $groupsIds[] = $kidGroup->id;
                }
                $groupsIds[] = $group->id; 
            }
            $result = $this->repository->productsByGroups($groupsIds, $locale);
        } else {
            return response()->json(['success' => false, 'data' => $result, 
                'message' => 'Groups products were not found']); 
        }
        return response()->json(['success' => true, 'data' => $result]);  
    }
        
    public function tasks($id)
    {
        $result = [];
        $group = $this->repository->get($id);
        if ($group) {
            $result = $group->allTasks();            
            if ($result) {
                return response()->json(['success' => true, 'data' => $result]);  
            }           
        }    
        return response()->json(['success' => false, 'data' => $result, 
            'message' => 'There is no tasks for this product']);                          
    }    
    
    /**
     * Adding task for product throw relationships
     * 
     * @param Request $request
     * @return json response
     */
    public function addTask(Request $request)
    {
        $group = $this->repository->get($request->product_group_id);        
        if ($group) {
            $result = $this->srv->addTaskToGroup($group, $request);
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Product group was not found']);     
        }         
        return response()->json(['success' => true, 'data' => $result, 
            'message' => 'Task was successfull added']);     
    }   
    
    public function editTask(Request $request, $groupId, $taskId)
    {
        $group = $this->repository->get($groupId); 
        if ($group) {
            $result = $this->srv->editTaskToGroup($group, $request, $taskId);
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Product group was not found']);     
        }         
        return response()->json(['success' => true, 'data' => $result, 
            'message' => 'Task was successfull edited']);                       
    }       
    
    public function deleteTask($groupId, $taskId)
    {
        $group = $this->repository->get($groupId);
        
        if ($group->tasks()->detach($taskId)) {            
            return response()->json(['success' => true, 'data' => $group->tasks]);     
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Error! Task was not deleted.']);     
        }
    }    
}

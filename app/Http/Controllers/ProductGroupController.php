<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ProductGroupRepository;
use Illuminate\Support\Facades\DB;
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
    
    /**
     * get products groups list with translations
     */
    public function index($locale = 'pl')
    {
        $data = $this->repository->getAllWithAdditionals();
                
        return response()->json(['success' => true, 'data' => $data]);        
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
            $latestTask = collect($group->allTasks())->last();            
            if ($latestTask) { $priority = $latestTask->priority + 1; } else { $priority = 1; }
            $group->tasks()->attach($request->task_id, 
                       ['duration' => $request->duration, 
                        'required' => $request->required, 
                        'priority' => $priority]);    
            $result = $group->tasks()->where("task_id", "=", $request->task_id)->get()[0];
            $result->duration = $result->pivot->duration;
            $result->priority = $result->pivot->priority;
            $result->required = $result->pivot->required;
            $result->product_group_id = $group->id;
            $result->task_id = $result->id;
        } else {
            return response()->json(['success' => false, 'data' => [], 
                'message' => 'Product group was not found']);     
        } 
        
        return response()->json(['success' => true, 'data' => $result, 
            'message' => 'Task was successfull added']);     
    }   
    
    public function editTask(Request $request, $groupId, $taskId)
    {
        DB::table('product_groups_tasks')
            ->where("product_group_id", "=", $groupId)
            ->where("task_id", "=", $taskId)
            ->update(['priority' => $request['priority'], 
                'duration' => $request['duration'],
                'required' => $request['required']]); 
        $group = $this->repository->get($groupId); 
        $result = $group->tasks()->where("task_id", "=", $taskId)->get()[0];
        $result->duration = $result->pivot->duration;
        $result->priority = $result->pivot->priority;
        $result->required = $result->pivot->required;
        $result->product_group_id = $group->id;
        $result->task_id = $result->id;        
        
        return response()->json(['success' => (boolean)$result, 'data' => $result]);     
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

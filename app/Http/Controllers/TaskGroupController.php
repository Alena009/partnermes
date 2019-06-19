<?php

namespace App\Http\Controllers;

//use App\TaskGroup;
use Illuminate\Http\Request;

use App\Repositories\TaskGroupRepository;

class TaskGroupController extends BaseController
{
    private $rep;
    
    public function __construct(TaskGroupRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get tasksk groups list with translations
     */
    public function taskgroups($locale = 'pl')
    {
        app()->setLocale($locale);

        $taskgroups = \App\Models\TaskGroup::all();
        
        return response()->json($taskgroups);        
    }   
    
    /**
     * create new departament with translations
     */
    public function create(Request $request)
    {
        $task_group = new \App\Models\TaskGroup();        
        $task_group->name = $request['name'];        
        $task_group->parent_id = $request['parent_id']; 
        $task_group->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $task_group->translateOrNew($locale)->name = "Title {$locale}";                        
        }

        $task_group->save();

        return true;
    } 
    
    public function groupsTasksTree()
    {
        $tasksGroups = $this->repository->getTasksGroupsRootNodes();   
        $tree = [];
        
        foreach ($tasksGroups as $group) {             
            $kids = array();
            if(count($group->kids)) {                
                $kids = $this->kidTree($group);
            } 
            $item = [
                'item' => $kids, 
                'id' => $group['id'], 
                'text' => $group['name'], 
                'value' => $group['id']
            ];

            $tree[] = $item;
        }              
        
        $result = ['data' => $tree, 'success' => true];
        
        return response()->json($result);
    } 
    
    /**
     * Get list of child groups for group-parent
     * 
     * @param object $group
     * @return array of kids
     */
    public function kidTree($group)
    {
        $kids = [];  
        $kid = [];
        
        foreach ($group->kids as $arr) {
            $kid = [                     
                    'id' => $arr['id'], 
                    'text' => $arr['name'], 
                    'value' => $arr['id']
                ];                
            //if kid has his own kids - use recursion
            if (count($arr->kids)) {                   
                $kid['items'] = $this->kidTree($arr);
            }      
            
            $kids[] = $kid;
        }
        
        return $kids;
    }    
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\DeclaredWorkRepository;
use App\Models\Task;

class DeclaredWorkController extends BaseController
{    
    protected $rep;
    
    public function __construct(DeclaredWorkRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function index() {
        return $this->getResponseResult($this->repository->getAllDeclaredWorks());
    }
    
    
    public function groupedWorks()
    {
        $groupedWorks = $this->repository->getDeclaredWorksGroupByKod();
        foreach ($groupedWorks as $work) {
            $work['key']   = $work['id'];
            $work['label'] = $work['kod'];
        }
        return $this->getResponseResult($groupedWorks);
    }
    
    /**
     * Get list of declared works by task groups ids
     * 
     * @return response
     */
    public function listWorksByGroups($groups = 0)
    {   
        if ($groups) {  
            $groupsIds = explode(',', $groups);            
            return $this->getResponseResult($this->
                    getDeclaredWorksByTaskGroups($groupsIds));     
        } else {
            return $this->getResponseResult($this->repository->getAllDeclaredWorks());    
        }        
    }  
    
    /**
     * Get list of declared works by order position id
     * 
     * @param int order position id
     * @return response
     */
    public function listWorksForOrderPos($position)
    {   
        return $this->getResponseResult($this
                ->getDeclaredWorksByOrderPosition($position));               
    }    
    
    /**
     * Get list of declared works by zlecenie
     * 
     * @return response
     */
    public function listWorksForZlecenie($declaredWorkId)
    {   
        return $this->getResponseResult($this
                ->getDeclaredWorksByZlecenie($declaredWorkId));                   
    }    
    
    /**
     * Gets all declared works
     * 
     * @return array
     */
//    public function getAllDeclaredWorks()
//    {
//        return $this->repository->getAllDeclaredWorks();
//    }
    
    /**
     * Gets declared works by tasks groups ids
     * 
     * @param str $groupsIds
     * @return array
     */
    public function getDeclaredWorksByTaskGroups($groupsIds)
    {
        $tasksIdsByGroupsIds = Task::whereIn("task_group_id", $groupsIds)->pluck("id");
        return $this->repository->getDeclaredWorksByTasksIds($tasksIdsByGroupsIds);
    }  
    
    /**
     * Gets declared works by order position id
     * 
     * @param int order position id
     * @return array
     */
    public function getDeclaredWorksByOrderPosition($positionId)
    {
        return $this->repository->getDeclaredWorksByOrderPosition($positionId);
    } 

    /**
     * Gets list of declared works for zlecenie 
     * by id of one of works from zlecenie
     * 
     * @param int declared work id
     * @return array
     */
    public function getDeclaredWorksByZlecenie($declaredWorkId)
    {
        return $this->repository->getDeclaredWorksByZlecenie($declaredWorkId);
    } 

    /**
     * Stores declared works with specified code
     * 
     * @param Request $request
     * @return response
     */    
    public function store(Request $request) 
    {        
        //$request['kod'] = 'T-' . idate('U'); 
        $request['kod'] = $request['order_position_id'] . $request['product_id']; 
        return parent::store($request);          
    } 
    
    /**
     * Makes general zlecenie for several zlecen
     * 
     * @param type $works
     * @return type
     */
    public function makeGeneral($works) 
    {
        $worksIds = explode(',', $works);
        $declaredWorks = $this->repository
                ->getAllDeclaredWorksInZlecenieBySeveralWorksIds($worksIds);                
        $kod = 'T-' . idate('U');
        
        if ($declaredWorks) {           
            foreach ($declaredWorks as $work) {                                
                $work->kod = $kod;                
                $work->save();
            }
        }
        
        return $this->getResponseResult($declaredWorks);          
    }
    
    /**
     * Deletes whole zlecenie by declared works ids form this zlecenie
     * 
     * @param array $worksIds
     * @return response
     */    
    public function deleteZlecenie($worksIds)
    {                
        $worksIdsArray = explode(',', $worksIds);        
        $declaredWorks = $this->repository
                ->getAllDeclaredWorksInZlecenieBySeveralWorksIds($worksIdsArray); 
        if ($declaredWorks) {           
            foreach ($declaredWorks as $work) {                                
                if (!$work->delete()) {
                        return $this->getResponseResult($work);                    
                }
            }
        }

        return $this->getResponseResult($declaredWorks);                    
    }
    
}

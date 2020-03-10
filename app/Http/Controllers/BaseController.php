<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\FilterTrait;
use Illuminate\Http\Request;
use Route;
use Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class BaseController extends Controller
{
    //use FilterTrait;

    protected $repository;
    protected $requestName;
    protected $srv;
    protected $viewName = 'home';
            
    public function __construct()
    {
    }

    protected function setRepository($repository)
    {
        $this->repository = $repository;
    }

    protected function getRepository()
    {
        return $this->repository;
    }
    
    protected function setService($srv)
    {
        $this->srv = $srv;
    }

    protected function getService()
    {
        return $this->srv;
    }    
    
    protected function setRequestName($requestName)
    {
        $this->requestName = $requestName;
    }

    protected function setViewName($viewName)
    {
        $this->viewName = $viewName;
    }

    protected function render($view, array $viewData = null)
    {
        return view($view, $viewData)
        ->with('routeName',  $this->getRouteName());
    }

    public function view(){
        return view($this->viewName);
    }

    /**
     * Zwraca dane z metody viewData controllera nadrzednego
     */
    private function getViewData($view, $item = null)
    {
        return method_exists($this, 'viewData') ? $this->viewData($view, $item) : [];
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($locale = 'pl'){  
        app()->setLocale($locale);
        $requestName = $this->requestName ? $this->requestName : 'BaseRequest';
        $request = \App::make('App\Http\Requests\\'.$requestName);
        
        //$model = $this->repository->getModel();
        $data = $this->repository->getAllWithAdditionals($locale);
        return ['data' => $data, 'success' => true];
    }

    public function store(Request $request, $locale = 'pl')
    {        
        app()->setLocale($locale);
        $requestName = $this->requestName ? $this->requestName : 'BaseRequest';
        $request = \App::make('App\Http\Requests\\'.$requestName);

        if ($data = $this->repository->create($request->all())){
            return ['success' => true, 'data' => $data, 
                        'class'=>__CLASS__,'method' => __METHOD__];            
        }else{
            return ['success' => false, 'all'=>$this->repository->errors(),
                'class'=>__CLASS__,'method' => __METHOD__];
        }
    }

    public function edit(Request $request, $id, $locale = 'pl')
    {        
        app()->setLocale($locale);
        $requestName = $this->requestName ? $this->requestName : 'BaseRequest';
        $request = \App::make('App\Http\Requests\\'.$requestName);

        if ($data = $this->repository->update($request->all(), $id)) {         
            return ['success' => true, 'data' => $data, 
                'class'=>__CLASS__,'method' => __METHOD__];                     
        }else{
            return ['success' => false, 'data'=>[], 'id' => $id,
                'message'=>$this->repository->errors(),
                'class'=>__CLASS__,'method' => __METHOD__];
        }
    }

    public function destroy($id, array $parameters = null)
    {
        if ($this->repository->delete($id)) {
            return ['success' => true,'class'=>__CLASS__,'method' => __METHOD__];
        }else{
            return ['success' => false, 'id' => $id,'msg'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
        }
    }

    public function show(Request $request,$id){
        $requestName = $this->requestName ? $this->requestName : 'BaseRequest';
        $request  = \App::make('App\Http\Requests\\'.$requestName); 
        $data = $this->repository->find($id);
        return ['success'=>$data?true:false,'data'=>$data];
    }

    public function options(Request $request){
        return ['options'=>$this->repository->options(),'class'=>__CLASS__,'method' => __METHOD__];
    }


    protected function getViewDirectory()
    {
        return $this->getRouteName();
    }

    /**
     * Dla user.index zwroci: "user"
     */
    protected function getRouteName()
    {
        return array_get(explode('.', Route::currentRouteName()), 0);
    }
    
    public function buildTree($locale = 'pl')
    {        
        return $this->getResponse($this->tree(0, $locale));
    }

    /**
     * Build struct for tree view on front-end
     * 
     * @return json 
     */    
    public function tree($parentId = 0, $locale = 'pl') {        
        app()->setLocale($locale);
        $model = $this->repository->getModel();
        if ($parentId) {
            $parents = $model::where('parent_id', '=', $parentId)->get('id', 'name');   
        } else {
            $parents = $model::where('parent_id', '=', null)->get('id', 'name');   
        }
        $tree = [];
        
        foreach ($parents as $parent) {             
            $kids = array();
            if(count($parent->kids)) {                
                $kids = $this->kidTree($parent);
            } 
            $item = [
                'items' => $kids, 
                'children' => $kids,
                'id' => $parent['id'], 
                'text' => $parent['name'], 
                'value' => $parent['id'],
                'key' => $parent['id'],
                'label' => $parent['name']
            ];

            $tree[] = $item;
        }                     
        
        return $tree;        
    }
    
    /**
     * Get list of child elements for tree
     * 
     * @param object $parentItem
     * @return array of kids
     */    
    protected function kidTree($item)
    {
        $kids = [];  
        $kid = [];
       
        foreach ($item->kids as $arr) {
            $kid = [                     
                    'id' => $arr['id'], 
                    'text' => $arr['name'], 
                    'value' => $arr['id'],
                    'key' => $arr['id'],
                    'label' => $arr['name'] 
                ];                
            //if kid has his own kids - use recursion
            if (count($arr->kids)) {                   
                $kid['items']    = $this->kidTree($arr);
            }
            $kids[] = $kid;
        }
        
        return $kids;
    }
    
    public function getAllChilds($groups)
    {             
        $model = $this->repository->getModel(); 
        $items = $model::find($groups);
        $result = [];
        
        foreach ($items as $item) {
            $result[] = $item->id;
            if ($item->kids) {
                foreach ($item->kids as $kid) {
                    $result[] = $kid->id;
                }
            }           
        }
        return $result;    
    }  


    /**
     * Returns result in response format
     * 
     * @param array $data
     * @return response
     */
    public function getResponse($data = [], $successMessage = '', $falseMessage = '')
    {
        if ($data) {
            return response()->json(['success' => true, 'data' => $data, 
                'message' => $successMessage]);  
        } else {
            return response()->json(['success' => false, 'data' => $data, 
                'message' => $falseMessage]);  
        }                
    }  
    
    public function getTranslations($id)
    {   
        $record = [];
        $record = $this->repository->getModel()::find($id);
        if ($record) {
            return $this->getResponse($record->translations);       
        }
        return $this->getResponse($record);        
    } 
    
    public function addTranslation(Request $request, $id, $locale = 'pl')
    {
        $record = [];
        $model = $this->repository->getModel();
        $record = $model::find($id);
        if ($record) {
            $record->translateOrNew($locale)->name = $request->name;          
            if ($request->description) {
                $record->translateOrNew($locale)->description = $request->description;  
            }
            if ($request->pack) {
                $record->translateOrNew($locale)->pack = $request->pack;  
            } 
            return $this->getResponse($record->save());
        }
        
        return $this->getResponse($record);       
    }
    
    public function deleteTranslation($id, $locale)
    {
        $record = [];
        $model = $this->repository->getModel();
        $record = $model::find($id);
        
        if ($record) {
            if ($record->deleteTranslations($locale)) {
                return $this->getResponse($record->translations);
            }
        } 
        
        return $this->getResponse($record);        
    }
        
    public function listByGroups($groups, $locale = 'pl')
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
            $result = $this->repository->childRecordsByGroups($groupsIds, $locale);
        } else {
            return response()->json(['success' => false, 'data' => $result, 
                'message' => 'Groups products were not found']); 
        }
        
        return response()->json(['success' => true, 'data' => $result]);         
    }
}

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
    public function index(){
        $requestName = $this->requestName ? $this->requestName : 'BaseRequest';
        $request = \App::make('App\Http\Requests\\'.$requestName);

        // return $this->repository
        // ->pushAppliedFilters($this->getAppliedFilters())
        // ->setOrderBy($this->getAppliedOrderBy())
        // ->paginate();
        return $this->repository->all($request);
    }

    public function store(Request $request)
    {
        $requestName = $this->requestName ? $this->requestName : 'BaseRequest';
        $request = \App::make('App\Http\Requests\\'.$requestName);

        if ($data = $this->repository->create($request->all())){
            // $data['success']=true;
            return ['success' => true, 'data'=>$data,'class'=>__CLASS__,'method' => __METHOD__];
        }else{
            return ['success' => false, 'all'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
        }
    }

    public function edit(Request $request, $id)
    {        
        $requestName = $this->requestName ? $this->requestName : 'BaseRequest';
        $request = \App::make('App\Http\Requests\\'.$requestName);

        if ($data = $this->repository->update($request->all(), $id)) {
            return ['success' => true, 'data'=>$data,'class'=>__CLASS__,'method' => __METHOD__];
        }else{
            return ['success' => false, 'data'=>[], 'id' => $id,'msg'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
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
        $request = \App::make('App\Http\Requests\\'.$requestName);
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
    
    /**
     * Build struct for tree view on front-end
     * 
     * @return json 
     */    
    public function buildTree() {
        $model = $this->repository->getModel();
        $parents = $model::where('parent_id', '=', 0)->get('id', 'name');   
        $tree = [];
        
        foreach ($parents as $parent) {             
            $kids = array();
            if(count($parent->kids)) {                
                $kids = $this->kidTree($parent);
            } 
            $item = [
                'items' => $kids, 
                'id' => $parent['id'], 
                'text' => $parent['name'], 
                'value' => $parent['id']
            ];

            $tree[] = $item;
        }                     
        
        return response()->json(['data' => $tree, 'success' => true]);        
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

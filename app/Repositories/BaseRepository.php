<?php

namespace App\Repositories;

use App\Repositories\Traits\FilterTrait;
use App\Repositories\Traits\PaginatorTrait;

use Illuminate\Container\Container as Application;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BaseRepository
{
    use SoftDeletes;
    //use FilterTrait;
    //use PaginatorTrait;

    protected $app;
    protected $model;

    protected $defaultOrderBy;
    protected $primaryOrderBy;
    protected $orderBy;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->makeModel();
    }

    public function makeModel()
    {
        $model = $this->app->make($this->model());
        if (!$model instanceof Model) {
            throw new \Exception("Class {$this->model()} must be an instance of Illuminate\\Database\\Eloquent\\Model");
        }

        return $this->model = $model;
    }    

    public function getModel()
    {
        return $this->model;
    }
    
    public function options()
    {
        if (!empty($this->model->getText()) && !empty($this->model->getPrimaryKey())) {
            return $this->model->get([$this->model->getPrimaryKey() . ' as value', $this->model->getText() . ' as text']);
        } else {
            return $this->model->get();
        }
    }

    public function all($request)
    {
        $limit = 0;
        $start = 0;
        $page = 0;
        $sort = null;
        $filter = null;
        $relationships = $this->model->getRelationships();
        $my_query = $this->model->query();
        if (is_array($relationships)) {
            $my_query->with($relationships);
        }
        foreach ($request->query() as $key => $value) {
            if (in_array($key, $this->model->getFillable())) {
                $values = explode("|",$value);
                if ($value==null){
                    $my_query->whereNull($key);
                }else{
                    $my_query->whereIn($key, $values);
                }
            }
            if (strtolower($key) == 'limit') {
                $limit = (int) $value;
            }
            if (strtolower($key) == 'start') {
                $start = (int) $value;
            }
            if (strtolower($key) == 'page') {
                $page = (int) $value;
            }
            if (strtolower($key) == 'sort') {
                $sort =  json_decode($value,true);
            }
            if (strtolower($key) == 'filter') {
                $filter =  json_decode($value,true);
            }
        }
        switch (config('database.default')){
            case 'pgsql': $like="ILIKE"; break;
            default: $like="LIKE"; break;
        }
        //info(print_r(config('database.default'),true));
        if (is_array($filter)){
            foreach ($filter as $f){
                if(isset($f['property'])&& isset($f['value'])){
                    if($f['property']=='*' ){
                        $columns= $this->model->getFillable();
                        foreach ($columns as $ff){
                            $type = \DB::getSchemaBuilder()->getColumnType($this->model->getTable(), $ff);
                            if ($type =='string') $my_query->orWhere($ff, $like, $f['value'] . '%');
                            else if ($type =='integer' && is_int($f['value'])) $my_query->Where($ff,"=",$f['value']);
                        }
                    }else{
                        //\Log::debug(['f'=>$f]);
                        $type = \DB::getSchemaBuilder()->getColumnType($this->model->getTable(), $f['property']);
                        //\Log::debug(['type'=>$type]);
                        if ($type =='string') $my_query->orWhere($f['property'], $like, $f['value'] . '%');
                        else if ($type =='integer'  && is_int($f['value'])) $my_query->Where($f['property'],"=",$f['value']);
                    }
                }
            }
            //where('book_name', 'LIKE', '%' . $input . '%')
            //->orWhere('another_column', 'LIKE', '%' . $input . '%')
        }

        $return['total'] = $my_query->get()->count();
        $skip = ($page - 1) * $limit;
        if ($skip != 0) {
            $my_query->skip($skip);
        }

        if ($limit != 0) {
            $my_query->take($limit);
        }

        if ($sort){
            if (is_array($sort)) foreach ($sort as $s){
                if (!empty($s['property'])) $my_query->orderBy($s['property'], $s['direction']);
            }
        }

        if (config('app.debug')) $return['sql'] = $my_query->toSql();
        $data = $my_query->get()->toArray();
        $return['data'] = $data;
        $return['success'] = true;
        return $return;
    }

    public function paginate($limit = 50, $columns = ['*'])
    {
        return $this->model->paginate($limit, $columns);
    }

    public function find($id, $columns = ['*'],$withRelations = true)
    {
        $relationships = $withRelations ? $this->model->getRelationships() : false;
        if (is_array($relationships)) {
            return $this->model::with($relationships)->findOrFail($id, $columns);
        }
        return $this->model->findOrFail($id, $columns);
    }

    public function findAll($field,$value)
    {
        $relationships = $this->model->getRelationships();
        if (is_array($relationships)) {
            $data = $this->model::with($relationships);
            foreach ($relationships as $relationship){
                $data->whereHas($relationship, function($query) use ($field,$value){
                    $query->where($field, $value);
                });
            }
            return $data->get();
        }
        return $this->model->findOrFail($id, $columns);
    }

    public function create(array $attributes)
    {
        $model = $this->model->create($attributes);
        $id = $model->getKey();
        return $model->save() ? $this->find($id) : false;
    }

    public function update(array $attributes, $id)
    {
        $model = $this->model->findOrFail($id);
        $model->fill($attributes);
        $relationships = $this->model->getRelationships();
        if (is_array($relationships)) {
            foreach ($relationships as $rs){
                if (isset($attributes[$rs])){
                    //\Log::debug('update',$attributes[$rs],true);
                    //foreach($attributes[$rs] as $i) $a[]=['id'=>$id];
                    $model->$rs()->sync($attributes[$rs]);
                }
            }
        }
        //dd($model->getKey() );
        return $model->save() ? $this->find($id) : false;
    }

    public function delete($id)
    {
        $model = $this->model->findOrFail($id);
        $relationships = $this->model->getRelationships();
        if (is_array($relationships)) {
            foreach ($relationships as $rs){
                //\Log::debug(['aaaaaa'=>$rs]);
                if (method_exists($model->$rs(), 'detach')){
                    $model->$rs()->detach();
                    //\Log::debug(['delete sync'=>$rs]);
                }else{
                    //\Log::debug(['delete !sync'=>$rs]);
                }
            }
        }
        return $model->delete();
    }

    public function pluck()
    {
        $args = func_get_args();

        $column = $args[0];
        $key = $args[1];
        $order = isset($args[2]) ? $args[2] : $column;
        $parameters = isset($args[3]) ? $args[3] : null;

        return $this->model->orderByRaw($order)->pluck($column, $key);
    }
    public function errors()
    {
        return ''; // $this->model->getErrors();
    }

    public function getDefaultOrderBy()
    {
        return $this->defaultOrderBy;
    }

    public function getRelationType($classname,$method){
        $obj = new $classname;
        $type = get_class($obj->{$method}());
        return $type;
    }
    public function setOrderBy($orderBy)
    {
        $this->orderBy = $orderBy;
        return $this;
    }

    protected function getOrderBy()
    {
        $defaultOrderBy = $this->defaultOrderBy ? $this->defaultOrderBy : $this->model->getPrimaryKey();
        $orderBy = $this->orderBy ? $this->orderBy : $defaultOrderBy;

        //dodaje sortowanie "unikatowe" np. ORDER BY name, user_id;
        $primaryOrderBy = $this->primaryOrderBy ? $this->primaryOrderBy : $this->model->getPrimaryKey();
        if (!in_array(trim(str_replace(['DESC', 'ASC'], '', $primaryOrderBy)), explode(' ', $orderBy))) {
            $orderBy.= ', '.$primaryOrderBy;
        }

        return $orderBy;
    }
    
    public function get($id)
    {
        $result = [];
        $result = $this->model::find($id);
        return $result;
    }    
    
    public function getAll()
    {
        $result = [];
        $result = $this->model::all();
        return $result;
    }     
    
    public function getWithAdditionals($id)
    {
        return $this->get($id);
    }
    
    public function getFewWithAdditionals($ids)
    {
        $data = [];
        foreach ($ids as $id) {
            $data[] = $this->getWithAdditionals($id);            
        }
        return $data;
    }
    
    public function getAllWithAdditionals()
    {
        return $this->getFewWithAdditionals($this->model::orderBy("id", "asc")
                ->pluck('id'));        
    }
    
    /**
     * Returns fields for translation
     * 
     * @return array
     */
    public function translatedFields()
    {
        $model = $this->getModel();
        return $model->translatedAttributes;               
    }

    /**
     * Sets translations for model 
     * 
     * @param type $locale
     * @param type $record
     * @param type $request
     * @return type
     */
    public function setTranslation($locale, $record, $request)
    {
        $translatedFields = $this->translatedFields();
        foreach ($translatedFields as $field) {
            $record->translateOrNew($locale)->$field = $request->$field;            
        } 
        return $record->save();
    } 
}

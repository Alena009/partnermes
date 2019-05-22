<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class BaseModel extends Model
{
    //use SoftDeletes;
    protected $table = '';
    protected $fillable = [];
    protected $relationships = [];
    protected $textField = '';
    protected $dates = ['deleted_at'];

    public function getTable(){
        return $this->table;
    }

    public function getFields(){
        return $this->fillable;
    }

    public function getRelationships(){
        return $this->relationships;
    }

    public function setRelationships($a = array()){
        $this->relationships=$a;
    }

    public function getText(){
        return $this->textField;
    }

    public function getPrimaryKey(){
        return $this->primaryKey;
    }
    // public function manyThroughMany($related, $through, $firstKey, $secondKey, $pivotKey)
    // {
    //     $model = new $related;
    //     $table = $model->getTable();
    //     $throughModel = new $through;
    //     $pivot = $throughModel->getTable();

    //     return $model
    //         ->join($pivot, $pivot . '.' . $pivotKey, '=', $table . '.' . $secondKey)
    //         ->select($table . '.*')
    //         ->where($pivot . '.' . $firstKey, '=', $this->id);
    // }
}

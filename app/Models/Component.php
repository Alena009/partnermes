<?php

namespace App\Models;

use \App\Models\BaseModel;

class Component extends BaseModel
{
    protected $table = "components";
    
    protected $fillable = [
        'product_id', 'component_id', 'amount'
    ];  
    
    public function product() 
    {
        return $this->belongsTo('App\Models\Product', 'component_id', 'id');
    }
    
    public function components() 
    {
        return $this->hasMany($this, 'product_id', 'component_id') ;
    }
     
}

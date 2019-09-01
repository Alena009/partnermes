<?php

namespace App\Models;

use \App\Models\BaseModel;

class Status extends BaseModel
{
    use \Dimsav\Translatable\Translatable; 
    
    protected $table = "statuses";
    
    protected $fillable = [
        'name'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];
    
    public function order()
    {
        return $this->belongsTo('App\Models\Order', 'order_id', 'id');
    }     
}

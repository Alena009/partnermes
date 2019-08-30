<?php

namespace App\Models;

use \App\Models\BaseModel;

class Order extends BaseModel
{    
    use \Dimsav\Translatable\Translatable;
    
    protected $table = "orders";
    
    protected $fillable = [
        'kod', 'client_id', 'start_date', 'end_date', 'name', 'description'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['name', 'description'];
    
    public function client() 
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id');
    }
    
    public function history()
    {
        return $this->belongsToMany("App\Models\Status", "orders_history", 'order_id', 'status_id');
    }
    
    public function positions()
    {
        return $this->hasMany('App\Models\OrderPosition');
    }    
}

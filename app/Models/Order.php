<?php

namespace App\Models;

use \App\Models\BaseModel;
use App\Models\OrderHistory;
use App\Models\Status;

class Order extends BaseModel
{    
    use \Astrotomic\Translatable\Translatable;
    
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
        return $this->hasMany('App\Models\OrderHistory');
    }
    
    public function positions()
    {
        return $this->hasMany('App\Models\OrderPosition');
    }
    
    public function changeStatus()
    {        
        $statuses = Status::all()->first();
        
        $orderHistory = new OrderHistory;
        $orderHistory->order_id = $this->id;
        $orderHistory->status_id = $statuses->id;
        
        return $orderHistory->save(); 
    }
        
    public function positionsInWork()
    {
        return $this->hasMany('App\Models\OrderPosition')->where("status", ">", 0)->get();
    }    
}

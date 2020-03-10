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
        'kod', 'description', 'client_id', 'start_date', 'end_date'
    ];
    
    /* fields for translating */    
    public $translatedAttributes = ['description'];
    
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
        return $this->hasMany('App\Models\OrderPosition')->where("status", "=", 2)->count("id");
    } 
    
    public function closedPositions()
    {
        return $this->hasMany('App\Models\OrderPosition')->where("status", "=", 3)->count("id");
    }    
    
    public function status()
    {
        return $this->belongsToMany('App\Models\Status', 'orders_history', 'order_id', 'status_id')
                ->withTimestamps();
    }  
    
    /**
     * Checks does current order is inner order
     */
    public function isInner() 
    {
        if ($this->client->id == 0) {
            return true;
        }        
        
        return false;
    }    
    
    public function close()
    {
        return $this->status()->attach(3);          
    }
}

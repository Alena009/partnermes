<?php

namespace App\Models;

use \App\Models\BaseModel;

class OrderPosition extends BaseModel
{
    protected $table = "orders_positions";
    
    protected $fillable = [
        'kod', 'order_id', 'amount', 'price', 'description', 'date_delivery', 
        'product_id', 'status', 'date_status'
    ];
    
    public function product()
    {
        return $this->belongsTo("App\Models\Product", "product_id", "id");        
    }    
    
    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }

    public function operations()
    {
        return $this->hasMany('App\Models\Operation', "order_position_id", "id");
    }  
    
//    public function declaredworks()
//    {        
//        return $this->hasMany('App\Models\DeclaredWork', "order_position_id", "id");
//    } 
//    
//    public function innerOrderPositions()
//    {        
//        return $this->belongsToMany('App\Models\OrderPosition', 'inner_outer_orders', 'outer_order_position_id', 'inner_order_position_id')                
//                ->withTimestamps(); 
//    }     
//    
//    public function outerOrderPositions()
//    {        
//        return $this->belongsToMany('App\Models\OrderPosition', 'inner_outer_orders', 'inner_order_position_id', 'outer_order_position_id')                
//                ->withTimestamps(); 
//    }     
    
    public function setPrinted()
    {
        $this->status = 2;
        $this->date_status = date("Y-m-d H:i:s");
        return $this->save();        
    }    
    
    public function setClosed()
    {
        $this->status = 3;
        $this->date_status = date("Y-m-d H:i:s");
        return $this->save();         
    }
    
    public function setLikeNew()
    {
        $this->status = 1;
        $this->date_status = date("Y-m-d H:i:s");
        return $this->save();        
    }    
    
    public function reOpen()
    {
        $this->status = 2;
        $this->date_status = date("Y-m-d H:i:s");
        return $this->save();        
    } 

    public function isNew()
    {
        if ($this->status == 1) {
            return true;
        }
        return false;        
    }    
    
    public function wasPrinted()
    {
        if ($this->status == 2) {
            return true;
        }
        return false;        
    }
    
    public function wasClosed()
    {
        if ($this->status == 3) {
            return true;
        }
        return false;
    }    
}

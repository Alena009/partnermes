<?php

namespace App\Repositories;
use Illuminate\Support\Facades\DB;

class OrderPositionRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\OrderPosition";
    }

    public function getPositionWithAdditionalFields($ids)
    {
        $positions = $this->find($ids);
        
        if ($positions) {
            foreach ($positions as $position) {
                $product                      = $position->product;
                $position->text               = $product->name;
                $position->value              = $position->id;        
                $position->product_id         = $product->id;
                $position->product_name       = $product->name;
                $position->product_kod        = $position->product->kod;
                $position->order_kod          = $position->order->kod;            
                $position->order_name         = $position->order->name;       
                $position->order_position_id  = $position->id;      
                $position->order_position_kod = $position->kod;                
                $position->key                = $position->id;
                $position->label              = $position->kod;
                $date = new \DateTime($position->date_delivery);
                $position->num_week           = $date->format("W");
                $position->summa              = $position->price * $position->amount;        
                $position->countWorks         = $position->operations->sum("done_amount");
                $position->declared           = $position->product->tasks->count() * $position->amount;
                $position->closed             = false; 
                if ($position->declared == $position->countWorks) {
                    $position->closed = true; 
                }
                               
            }
        }
        
        return $positions;        
    }  
  
    
    /**
     * Returns all positions with parameters 
     * which was added in the getPosition()
     * 
     * @return array
     */
    public function getAllPositionsWithAdditionalFields()
    {        
        return $this->getPositionWithAdditionalFields($this->model::all()->pluck("id"));
    }
     
    /**
     * Returns list of orders positions which does not have zlecenia 
     * 
     * @return array
     */
    public function getFreePositions()
    {
//        $positions = [];
//        $model = $this->getModel();
//        $freePositions = DB::select("SELECT * FROM orders_positions pos
//                                            where pos.id not in 
//                                            (select order_position_id from declared_works 
//                                            where product_id = pos.product_id)");
//        $positions = $model::find(array_column($freePositions, "id"))->pluck("id");
//        if ($positions) {
//            return $this->getPositionWithAdditionalFields($positions);
//        } else {
//            return $positions;
//        }    
//        $positions = [];
//        $model = $this->getModel();
//        $positions = $model::doesntHave('operations')->pluck("id");        
//        if ($positions) {
//            return $this->getPositionWithAdditionalFields($positions);
//        } else {
//            return $positions;
//        } 
        
        $data = [];
        $positionsIds = $this->model::where("status", "=", 1)->pluck("id");
        $data = $this->getPositionWithAdditionalFields($positionsIds);
        return $data;        
    }    
    
    
    public function isPositionAvailableForCreatingZlecenie($position)
    {
        $product     = $position->product;
        $components  = $product->components;

        if ($components) {
            foreach ($components as $component) {
                $availableAmount = Warehouse::where('product_id', '=', $component->component_id)
                        ->sum('amount');
                $neededAmount = $position->amount * $component->amount;
                if ($neededAmount > $availableAmount) {
                    return 0;
                }
            }  
        }
        
        return 1;
    }     
    
    /**
     * Returns result array
     * 
     * @param array of objects $declaredWorks
     * @return array
     */
    public function getResultPositionsWithAdditionalFields($positions)
    {
        $result = [];
        
        if ($positions) {
            foreach ($positions as $position) {
                $result[] = $this->
                        getPositionWithAdditionalFields($position->id);    
            }        
        }
        
        return $result;   
    }



}

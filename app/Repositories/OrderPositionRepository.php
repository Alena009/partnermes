<?php

namespace App\Repositories;
use Illuminate\Support\Facades\DB;

class OrderPositionRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\OrderPosition";
    }

    public function getPositionWithAdditionalFields($id)
    {
        $position = $this->find($id);
        
        if ($position) {
            $product                      = $position->product;
            $position->text               = $product->name;
            $position->value              = $position->id;             
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
        }
        
        return $position;        
    }  
  
    
    /**
     * Returns all positions with parameters 
     * which was added in the getPosition()
     * 
     * @return array
     */
    public function getAllPositionsWithAdditionalFields()
    {        
        return $this->getResultPositionsWithAdditionalFields($this->model::all());
    }
    
    /**
     * Returns list positions by ids
     * 
     * @param array $positionsIds
     * @return array
     */
    public function getPositionsByIdsWithAdditionalFields($positionsIds)
    {
        return $this->getPositionsByIds($this->getAllPositions());
    }   
    
    /**
     * Returns list of orders positions which does not have zlecenia 
     * 
     * @return array
     */
    public function getFreePositions()
    {
        $positions = [];
        $model = $this->getModel();
        $freePositions = DB::select("SELECT * FROM orders_positions pos
                                            where pos.id not in 
                                            (select order_position_id from declared_works 
                                            where product_id = pos.product_id)");
        $positions = $model::find(array_column($freePositions, "id"));
        
        return $positions;
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

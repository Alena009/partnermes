<?php

namespace App\Repositories;
use Illuminate\Support\Facades\DB;

class OrderPositionRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\OrderPosition";
    }

    public function getWithAdditionals($id)
    {
        $position = []; 
        $position = $this->model::find($id);
        
        if ($position) {
            $product                      = $position->product;
            $position->text               = $position->kod;
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
            $position->innerOrder         = $position->order->isInner();   
            $position->hasOpenWorks       = $position->operations; 
            if ($position->status == 2) {
                $position->printed = true;                 
                $position->closed = false;
            }              
            if ($position->status == 3) {
                $position->closed = true; 
                $position->printed = true;    
                $position->date_closed = $position->date_status; 
            }              
        }
        
        return $position;        
    }  
    
    /**
     * Returns list of orders positions which does not have zlecenia 
     * 
     * @return array
     */
    public function getPositionsWithTasks()
    {
        $result = [];        
        $positionsIds = DB::table('orders_positions')
            ->join('orders_history', 'orders_positions.order_id', '=', 'orders_history.order_id')                            
            ->select('orders_positions.*')
            ->where("orders_history.status_id", "<>", 3) 
            ->pluck("id");

        $positions = $this->model::find($positionsIds);
        foreach($positions as $position) {            
            if (count($position->product->allTasks())) {                
                $position = $this->getWithAdditionals($position->id);
                $result[] = $position;                
            }
        }
        return $result; 
    }    
        
    /**
     * Returns list of orders positions which was printed 
     * 
     * @return array
     */
    public function getPrintedPositions()
    {
        return $this->getFewWithAdditionals($this->model::where("status", "=", 2)->pluck("id"));        
    }     
      
    
    public function getDate($numWeek) 
    {
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($numWeek < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        
        return $date->setISODate($year, $numWeek)->format('Y-m-d');        
    }
}

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
            //$position->text               = $product->name;
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
            //$position->declared           = $position->product->tasks->count() * $position->amount;         
            //$position->tasks              = count($position->product->allTasks());
            $position->closed             = false; 
            $position->done_amount        = $this->getDoneAmount($position);
            if ($position->status == 3) {
                $position->closed = true; 
                $position->date_closed = $position->date_status; 
            }   
            if ($position->status == 2) {
                $position->printed = true;                 
            }             
        }
        
        return $position;        
    }  
     
    public function getDoneAmount($position) 
    {
        $product = $position->product;
        $operations = $position->operations;       
        $lastTask = $product->getLastTask();    
       
        if ($lastTask) {
            return $operations->where("task_id", "=", $lastTask->id)
                   ->sum("done_amount");
        } else {
            return 0; 
        }
    }
    
    /**
     * Returns list of orders positions which does not have zlecenia 
     * 
     * @return array
     */
    public function getPrintedPositions()
    {
        return $this->getFewWithAdditionals($this->model::where("status", "=", 2)->pluck("id"));        
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
    
    public function get($ids) 
    { 
        $positions = [];

        if (count($ids)) {        
            $positions = $this->model::find($ids);
        }
        
        return $positions;        
    }
    
    public function getTasks($id) 
    {
        $result = [];        
        $position = $this->model::find($id);        
        if ($position) {
            $declaredWorks = $position->declaredworks;
            if ($declaredWorks) {
                return $declaredWorks;
            } else {
                return $position->product->tasks;
            }
        }        
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

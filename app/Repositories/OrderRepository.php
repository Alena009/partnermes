<?php

namespace App\Repositories;

class OrderRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Order";
    }
    
    public function getWithAdditionals($id) 
    {
        $order = [];
        $order = $this->model::find($id);
        
        if ($order) {
            $order->client_name  = $order->client->name;               
            $order->text         = $order->kod;
            $order->value        = $order->id;
            $date = new \DateTime($order->date_end);
            $order->num_week     = $date->format("W");
            $order->hasopenworks = count($order->positionsInWork()); 
        }
        
        return $order;
    }
    
    public function getFewWithAdditionals($ids)
    {
        $data = [];
        foreach ($ids as $id) {
            $data[] = $this->getWithAdditionals($id);            
        }
        return $data;
    }
    
    public function getAllWithAdditionals()
    {
        return $this->getFewWithAdditionals($this->model::orderBy("id", "desc")->pluck('id'));        
    }

    public function getStatus($step)
    {
        if ($step == "new") {
            
        }
        
        return $statusId;
    }
}

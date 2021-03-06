<?php

namespace App\Repositories;

class OrderRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Order";
    }
    
    public function getWithAdditionals($id, $locale = 'pl') 
    {
        $order = [];
        $order = $this->model::find($id);
        
        if ($order) {
            $order->client_name     = $order->client->name;               
            $order->text            = $order->kod;
            $order->value           = $order->id;
            $date = new \DateTime($order->date_end);
            $order->num_week        = $date->format("W");      
            $order->positionsInWork = $order->positionsInWork();
            $order->closedPositions = $order->closedPositions();
        }
        
        return $order;
    }  
    
    public function lastOrder()
    {
        $order = [];
        $order = $this->model::orderby('id', 'desc')->first();
        
        return $order;
    }
}

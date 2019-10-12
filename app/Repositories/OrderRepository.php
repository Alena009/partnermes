<?php

namespace App\Repositories;

class OrderRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Order";
    }
    
    public function getStatus($step)
    {
        if ($step == "new") {
            
        }
        
        return $statusId;
    }
}

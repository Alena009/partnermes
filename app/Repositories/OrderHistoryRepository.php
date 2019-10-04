<?php

namespace App\Repositories;

class OrderHistoryRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\OrderHistory";
    }
    
    public function allWithStatuses()
    {
        $historyRecords = $this->model::all();
        
        foreach ($historyRecords as $rec) {
            $status = $rec->status;
            $rec->name = $status->name;
            $rec->description = $status->description;
        }
        
        return $historyRecords;
    }
}

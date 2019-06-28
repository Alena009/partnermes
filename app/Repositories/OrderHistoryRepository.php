<?php

namespace App\Repositories;

class OrderHistoryRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\OrderHistory";
    }
}

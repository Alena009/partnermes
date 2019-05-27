<?php

namespace App\Repositories;

class OrderRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Order";
    }
}

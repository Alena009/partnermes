<?php

namespace App\Repositories;

class ProductRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Product";
    }
}

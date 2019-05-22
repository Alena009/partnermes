<?php

namespace App\Repositories;

class WorkersRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Worker";
    }
}

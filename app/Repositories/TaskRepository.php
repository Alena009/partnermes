<?php

namespace App\Repositories;

class TaskRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Task";
    }
}

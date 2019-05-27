<?php

namespace App\Repositories;

class PermissionRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Permission";
    }
}

<?php

namespace App\Repositories;

class RolePermissionRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\RolePermission";
    }
}

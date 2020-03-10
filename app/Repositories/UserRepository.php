<?php

namespace App\Repositories;

class UserRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\User";
    }        
}

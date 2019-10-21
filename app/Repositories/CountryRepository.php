<?php

namespace App\Repositories;

class CountryRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Country";
    }
}

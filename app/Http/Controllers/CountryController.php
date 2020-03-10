<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\CountryRepository;

class CountryController extends BaseController
{
    protected $rep;
    
    public function __construct(CountryRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\CountryRepository;
use App\Models\Country;

class CountryController extends BaseController
{
    protected $rep;
    
    public function __construct(CountryRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function index() 
    {
        $result = [];
        $result = Country::all();
        
        foreach ($result as $res) {
            $res['value'] = $res->id;
            $res['text']  = $res->name;
        }         
        
        return $this->getResponseResult($result);
    }
}

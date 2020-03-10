<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\LanguageRepository;

class LanguageController extends BaseController
{
    protected $rep;
    
    public function __construct(LanguageRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }  
    
    
}

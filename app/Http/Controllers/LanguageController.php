<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\LanguageRepository;
use App\Models\Language;

class LanguageController extends BaseController
{
    protected $rep;
    
    public function __construct(LanguageRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function index() 
    {
        $result = [];
        $result = Language::all();
        
        foreach ($result as $res) {
            $res['value'] = $res->id;
            $res['text']  = $res->short;
        }         
        
        return $this->getResponseResult($result);
    }    
}

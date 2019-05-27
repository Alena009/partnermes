<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\StatusRepository;

class StatusController extends BaseController
{
    private $rep = StatusRepository;
    
    public function __construct(StatusRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get statuses list with translations
     */
    public function statuses($locale = 'pl')
    {
        app()->setLocale($locale);

        $sstatuses = \App\Models\Status::all();
        
        return response()->json($statuses);        
    }

    /**
     * create new departament with translations
     */
    public function create(Request $request)
    {
        $status = new \App\Models\Status();
        $status->name = $request['name'];               
        $status->description = $request['description'];
        $status->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $status->translateOrNew($locale)->name = "Title {$locale}";            
            $status->translateOrNew($locale)->description = "Title {$locale}";            
        }

        $status->save();

        return true;
    }  
}

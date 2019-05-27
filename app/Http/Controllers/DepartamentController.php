<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\DepartamentRepository;

class DepartamentController extends BaseController
{
    private $rep;
    
    public function __construct(DepartamentRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    /**
     * get departaments list with translations
     */
    public function departaments($locale = 'pl')
    {
        app()->setLocale($locale);

        $departaments = \App\Models\Departament::all();
        
        return response()->json($departaments);
    }
    
    /**
     * create new departament with translations
     */
    public function create(Request $request)
    {
        $departament = new \App\Models\Departament();
        $departament->parent_id = $request['parent_id'];        
        $departament->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $departament->translateOrNew($locale)->name = "Title {$locale}";            
        }

        $departament->save();

        return true;
    }
}

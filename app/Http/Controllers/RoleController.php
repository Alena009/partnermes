<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\RoleRepository;

class RoleController extends BaseController
{
    private $rep = RoleRepository;
    
    public function __construct(RoleRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get roles list with translations
     */
    public function roles($locale = 'pl')
    {
        app()->setLocale($locale);

        $roles = \App\Models\Role::all();
        
        return response()->json($roles);        
    }

    /**
     * create new role with translations
     */
    public function create(Request $request)
    {
        $role = new \App\Models\Role();
        $role->name = $request['name'];        
        $role->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $role->translateOrNew($locale)->name = "Title {$locale}";                        
        }

        $role->save();

        return true;
    }    
}

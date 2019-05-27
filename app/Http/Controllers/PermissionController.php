<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\PermissionRepository;

class PermissionController extends BaseController
{
    private $rep;
    
    public function __construct(PermissionRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }   
    
    /**
     * Get permissions list with translations
     */
    public function permissions($locale = 'pl')
    {
        app()->setLocale($locale);

        $permissions = \App\Models\Permission::all();
        
        return response()->json($permissions);        
    }

    /**
     * create new permission with translations
     */
    public function create(Request $request)
    {
        $permission = new \App\Models\permission();       
        $permission->name = $request['name'];        
        $permission->description = $request['description'];
        $permission->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $permission->translateOrNew($locale)->name = "Title {$locale}";            
            $permission->translateOrNew($locale)->description = "Title {$locale}";            
        }

        $permission->save();

        return true;
    }        
}

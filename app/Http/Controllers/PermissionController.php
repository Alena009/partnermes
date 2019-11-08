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
    public function index($locale = 'pl')
    {
        app()->setLocale($locale);
        
        $allPermissions = $this->repository->getModel()::all();
        foreach ($allPermissions as $permission) {
            $permission->text  = $permission->description;
            $permission->value = $permission->id;
        }
        
        return response()->json(['data' => $allPermissions, 'success' => true]);  
    }

    /**
     * create new permission with translations
     */
    public function create(Request $request)
    {
        $permission = new \App\Models\permission();       
        $permission->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {            
            $permission->translateOrNew($locale)->description = "Title {$locale}";            
        }

        $permission->save();

        return true;
    }        
}

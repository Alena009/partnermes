<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\RoleRepository;

class RoleController extends BaseController
{
    private $rep;
    
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

        $roles = $this->repository->getModel()::all();               
        
        foreach ($roles as $role) {             
            $item = [               
                'id' => $role['id'], 
                'text' => $role['name'], 
                'value' => $role['id']
            ];
            $result[] = $item;
        }              
        
        $result = ['data' => $result, 'success' => true];
        
        return response()->json($result);      
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

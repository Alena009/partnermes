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

    public function getUsersRolesTree()
    {
        $roles = [];
        $result = [];
        $userModel = new \App\Models\User(); 
        
        $roles = $this->repository->getModel()::all();               
        
        foreach ($roles as $role) { 
            $role['value'] = $role['id'];
            $role['text'] = $role['name'];                   

            
            $result[] = $role;
        }     
        
        $result = ['data' => $result, 'success' => true];
        
        return response()->json($result);
    } 

    public function show(Request $request, $id)
    {
        $permissions = [];
        
        $data = $this->repository->find($id);
        
        $permissions = $data->permissions;
        if (count($permissions)) {
            foreach ($permissions as $permission) {
                $permission['value'] = \App\Models\RolePermission::where('role_id', $id)
                        ->where('permission_id', $permission->id)
                        ->pluck('value')[0];
            }
        }
        
        return ['success'=>$data?true:false,'data'=>$data];
    }
    
//    public function getPermissions($role)
//    {
//        $permissions = $role->permissions;
//        if (count($permissions)) {
//            foreach ($permissions as $permission) {
//                \App\Models\Permission::find($permission->id);
//            }
//        }
//    }

}


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
        
        $roles = [];
        $result = [];

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
    public function store(Request $request)
    {
        $result = [];
        
        $role = new \App\Models\Role();
        $locale = app()->getLocale();
        $role->save();
        
        $role->translateOrNew($locale)->name = $request['name'];            
        $success = $role->save();
        
        $result = ['data' => $role, 'success' => $success];
        
//        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
//            $role->translateOrNew($locale)->name = "Title {$locale}";                        
//        }    

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
    
    /**
     * List of permissions by role
     * 
     * @param integer $roleId
     * @return response
     */
    public function listPermissions($roleId)
    {
        $data = [];
        $role = $this->repository->getModel()::find($roleId);
         
        if ($role) {
            $data = $role->permissions;
            foreach ($data as $d) {
                $d->value = $d->pivot->value;
            }           
        }
        
        return ['success'=>$data?true:false,'data'=>$data];
    }
    
    /**
     * List of permissions free for this role
     * 
     * @param integer $roleId
     * @return response
     */
    public function listFreePermissions($roleId)
    {
        $busyPermissionsIds = [];                  
        $busyPermissionsIds = \App\Models\RolePermission::where("role_id", "=", $roleId)
                ->pluck("permission_id");
        
        if ($busyPermissionsIds) {
            $permissions = \App\Models\Permission::whereNotIn("id", $busyPermissionsIds)->get();
        } else {
            $permissions = \App\Models\Permission::all();
        }
        foreach ($permissions as $permission) {
            $permission->text  = $permission->description;
            $permission->value = $permission->id;
        }
                             
        return ['success'=>$permissions?true:false,'data'=>$permissions];
    }    
    
    /**
     * List users by roles
     * 
     * @param int $roleId
     * @return response
     */
    public function listUsers($roleId)
    {
        $data = [];
        
        if (!$roleId) {
            $data = \App\Models\User::all();
        } else {
            $role = $this->repository->get($roleId);        
            $data = $role->users;
        }
        
        foreach ($data as $d) {            
            $role = $d->role;
            if (!$role->isEmpty()) {
                $d['role_name'] = $role[0]->name;
            } else {
                $d['role_name'] = "";
            }
        }
        
        return ['success'=>$data?true:false,'data'=>$data];
    }    

}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\RolePermissionRepository;

class RolePermissionController extends BaseController
{
    private $rep;
    
    public function __construct(RolePermissionRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function editByRoleAndPermissionId(Request $request)
    {
        $record = $this->repository->getModel()::where('role_id', $request->role_id)
                    ->where('permission_id', $request->permission_id)->first();
        if ($data = $this->repository->update($request->all(), $record->id)) {
            return ['success' => true,'class'=>__CLASS__,'method' => __METHOD__];
        }else{
            return ['success' => false, 'msg'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
        }     
    }
    
    /**
     * Adding all permissions for new role. 
     * All permissions add with false value.     * 
     * 
     * @param type $roleId
     * @return type
     */
    public function addPermissionsForNewRole($roleId)
    {
        $allPermissions = \App\Models\Permission::all();
        
        foreach ($allPermissions as $permission) {
            $rolepermission = new \App\Models\RolePermission;
            $rolepermission->create(['role_id' => $roleId, 
                                     'permission_id' => $permission->id, 
                                     'value' => 0]);
        }
        
        $result = ['success' => true];
        
        return response()->json($result);      
    }
    
    /**
     * Adding new permission to all roles. 
     * New permission add with false value.
     * 
     * @param integer $permissionId
     */
    public function addNewPermissionToRoles($permissionId)
    {
        $allRoles = \App\Models\Role::all();
        
        foreach ($allRoles as $role) {
            $rolepermission = new \App\Models\RolePermission;
            $rolepermission->create(['role_id' => $role->id, 
                                     'permission_id' => $permissionId, 
                                     'value' => 0]);
        }
        
        $result = ['success' => true];
        
        return response()->json($result); 
    }
    
    /**
     * create new role with translations
     */
    public function store(Request $request)
    {
        $result = [];
        
        $permission = new \App\Models\Permission();
        $locale = app()->getLocale();
        $permission->save();
        
        $permission->translateOrNew($locale)->name = $request['name'];            
        $permission->translateOrNew($locale)->description = $request['description'];            
        $success = $permission->save();
        
        $result = ['data' => $permission, 'success' => $success];
        
//        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
//            $role->translateOrNew($locale)->name = "Title {$locale}";                        
//        }    

        return response()->json($result);
    }     
}

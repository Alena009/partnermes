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
    
    public function deleteByRoleAndPermissionId(Request $request)
    {
        $record = \App\Models\RolePermission::where('role_id', $request->role_id)
                    ->where('permission_id', $request->permission_id);
        if ($record->delete()) {
            return ['success' => true,'class'=>__CLASS__,'method' => __METHOD__];
        }else{
            return ['success' => false, 'msg'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
        }
    }
}

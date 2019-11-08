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
    
    public function deleteByRoleAndPermissionId(Request $request)
    {        
        $record = $this->repository->getModel()::where('role_id', $request->role_id)
                    ->where('permission_id', $request->permission_id)->first();
        if ($this->repository->delete($record->id)) {
            return ['success' => true,'class'=>__CLASS__,'method' => __METHOD__];
        }else{
            return ['success' => false, 'id' => $id,'msg'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
        }     
    }     
}

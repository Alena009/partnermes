<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\UserRoleRepository;

class UserRoleController extends BaseController
{
    private $rep;
    
    public function __construct(UserRoleRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function deleteByRoleAndUserId(Request $request)
    {
        $record = \App\Models\UserRole::where('role_id', $request->role_id)
                    ->where('user_id', $request->user_id);
        if ($record->delete()) {
            return ['success' => true,'class'=>__CLASS__,'method' => __METHOD__];
        }else{
            return ['success' => false, 'msg'=>$this->repository->errors(),'class'=>__CLASS__,'method' => __METHOD__];
        }
    }
}

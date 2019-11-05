<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\DeclaredWorkRepository;
use \Illuminate\Support\Facades\DB;

class DeclaredWorkController extends BaseController
{    
    protected $rep;
    
    public function __construct(DeclaredWorkRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    public function savework(Request $request)
    {
        try {
            DB::table('declared_works')->where('order_position_id', '=', $request['order_position_id'])
                    ->where("task_id", "=", $request['task_id'])
                    ->delete();
            return parent::store($request);             
        } 
        catch(Exception $e) {
            $data = ["data" => [], "success" => false, "message" => $e->getMessage()];
            return $this->getResponseResult($data);
        }               
    }    
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ComponentRepository;
use App\Models\Warehouse;

class ComponentController extends BaseController
{
    private $rep;
    
    public function __construct(ComponentRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }  
    
    public function index()
    {
        $components = $this->repository->allWithAdditionals();
        if ($components) {
            foreach ($components as $component) {
                $component->amount_available = Warehouse::where('product_id', '=', $component->component_id)
                                                    ->sum('amount'); 
            }          
        }
        
        return $this->getResponseResult($components);
    }
}

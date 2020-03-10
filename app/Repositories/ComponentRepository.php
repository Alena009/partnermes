<?php

namespace App\Repositories;
use App\Http\Resources\ComponentResource;
use App\Models\Warehouse;

class ComponentRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Component";
    }
    
    public function getWithAdditionals($id, $locale = 'pl') 
    {    
        $result = parent::getWithAdditionals($id, $locale);
        if ($result) {
            $result->text  = $result->name;
            $result->value = $result->id;
            $result->kod   = $this->product->kod;            
            $result->name  = $this->product->name;
            $result->product_type_name  = $this->product->type->name;
            $result->product_group_name = $this->product->group->name; 
            $result->amount_available = Warehouse::where('product_id', '=', $this->component_id)
                                                    ->sum('amount'); 
        }
        return $result;            
    }    
}

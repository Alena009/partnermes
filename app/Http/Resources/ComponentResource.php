<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ComponentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $product = $this->product;
        
        return [
            'kod'                => $product->kod,            
            'name'               => $product->name,
            'product_type_name'  => $product->type->name,
            'product_group_name' => $product->group->name,
            'component_id'       => $this->component_id,
            'product_id'         => $this->product_id,
            'amount'             => $this->amount,
            'height'             => $this->height,
            'width'              => $this->width
        ];  
    }
}

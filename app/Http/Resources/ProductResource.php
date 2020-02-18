<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'product_name'       => $this->name,
            'product_kod'        => $this->kod,
            'text'               => $this->name,
            'value'              => $this->id,
            'product_type_name'  => $this->type->name,
            'product_group_name' => $this->group->name            
        ];
    }
}

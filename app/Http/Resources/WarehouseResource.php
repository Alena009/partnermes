<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
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
            'product_name'       => $product->name,
            'product_kod'        => $product->kod,
            'group_name'         => $product->group->name,
            'amount'             => $this->amount,
            'reserved'           => $this->reserved            
        ];
    }
}

<?php

namespace App\Models;

use App\Models\BaseModel;

class Sending extends BaseModel
{
    protected $table = "sendings";
    
    protected $fillable = [
        'kod', 'date_sending', 'client_id'
    ];
    
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id');
    }
}

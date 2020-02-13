<?php

namespace App\Models;

use App\Models\BaseModel;

class ToolOperation extends BaseModel
{
    protected $table = "users_tools";
    
    protected $fillable = [
        'user_id', 'tool_id', 'type_operation', 'amount'
    ];
    
    public function tool()
    {
        return $this->belongsTo('App\Models\Tool', 'tool_id', 'id');
    }
    
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }       
}

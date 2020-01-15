<?php

namespace App\Repositories;

class UserRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\User";
    }
    
    public function getWithAdditionals($id)
    {
        $user = $this->model::find($id);
        
        $user->key   = $user->id;
        $user->label = $user->name; 
        $user->value = $user->id;
        $user->text  = $user->name;  
        
        return $user;
    }    
       
}

<?php

namespace App\Repositories;

class SendingRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\Sending";
    } 
    
    public function getWithAdditionals($id) 
    {       
        $sending = $this->model::find($id);
        if ($sending) {
            $sending->client_name = $sending->client->name;
        }
        
        return $sending;
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\ClientRepository;

class ClientController extends BaseController
{
    private $rep = ClientRepository;
    
    public function __construct(ClientRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    }
    
    /**
     * get clients list with translations
     */
    public function clients($locale = 'pl')
    {
        app()->setLocale($locale);

        $clients = \App\Models\Clients::all();
        
        return response()->json($clients);
    }
    
    /**
     * create new client with translations
     */
    public function create(Request $request)
    {
        $client = new \App\Models\Client();
        $client->kod = $request['kod'];        
        $client->name = $request['name'];        
        $client->address = $request['address'];        
        $client->country = $request['country'];        
        $client->contacts = $request['contacts'];        
        $client->save();

        foreach (['en', 'nl', 'fr', 'de'] as $locale) {
            $client->translateOrNew($locale)->name = "Title {$locale}";            
            $client->translateOrNew($locale)->address = "Title {$locale}";  
            $client->translateOrNew($locale)->country = "Title {$locale}";            
            $client->translateOrNew($locale)->contacts = "Title {$locale}";            
        }

        $client->save();

        return true;
    }
}

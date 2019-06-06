<?php

use Illuminate\Database\Seeder;
use App\Models\Component;

class ComponentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Models\Component::class, 10)->create();        
    }
}

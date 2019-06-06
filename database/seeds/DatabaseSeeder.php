<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //$this->call(UsersTableSeeder::class);
        $this->call(ClientsTableSeeder::class);
        $this->call(OrdersTableSeeder::class);
        //$this->call(ProductTypesTableSeeder::class);
        //$this->call(ProductGroupsTableSeeder::class);
        $this->call(ProductsTableSeeder::class);
        $this->call(ComponentsTableSeeder::class);
    }
}

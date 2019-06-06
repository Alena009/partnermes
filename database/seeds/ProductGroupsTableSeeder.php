<?php

use App\Model\ProductGroup;
use Illuminate\Database\Seeder;

class ProductGroupsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Models\ProductGroup::class, 10)->create();
    }
}

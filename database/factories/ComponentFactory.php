<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Model;
use Faker\Generator as Faker;

$factory->define(\App\Models\Component::class, function (Faker $faker) {
    return [
        
        'product_id' => rand(1, 10),
        'component_id' => rand(1, 10),
        'amount' => rand(1, 100)
    ];
});

<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Model\Order;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(App\Models\Order::class, function (Faker $faker) {
    return [
        'kod' => Str::random(10),
        'client_id' => rand(1, 10),
        'date_start' => $faker->dateTime,
        'date_end' => $faker->dateTime        
    ];
});



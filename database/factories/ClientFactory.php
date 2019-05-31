<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Model\Client;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(App\Models\Client::class, function (Faker $faker) {
    return [
        'kod' => Str::random(10),
        'name' => $faker->company,
        'address' => $faker->address,
        'country' => $faker->country,
        'contacts' => $faker->companyEmail,        
    ];
});

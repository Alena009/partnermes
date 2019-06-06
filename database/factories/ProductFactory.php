<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Model\Product;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(\App\Models\Product::class, function (Faker $faker) {
    return [
        'kod' => Str::random(10),
        'product_type_id' => rand(1, 10),
        'weight' => rand(2, 100),
        'height' => rand(1, 5),        
        'width' => rand(1, 5),        
        'length' => rand(1, 5), 
        'pictures' => $faker->fileExtension,
        'product_group_id' => rand(1, 10),
        'area' => rand(1, 10),
    ];
});

<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Model\ProductGroup;
use Faker\Generator as Faker;

$factory->define(\App\Models\ProductGroup::class, function (Faker $faker) {
    return [
        'parent_id' => 3,
    ];
});

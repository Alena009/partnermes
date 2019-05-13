<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('kod', '45')->unique();
            $table->string('name', '45');
            $table->UnsignedInteger('product_type_id');            
            $table->foreign('product_type_id')->references('id')->on('product_types');            
            $table->float('weight', '8', '2');
            $table->integer('height')->nullable();
            $table->integer('width')->nullable();
            $table->integer('length')->nullable();
            $table->string('pictures', '155');
            $table->string('description', '155');
            $table->UnsignedInteger('product_group_id');            
            $table->foreign('product_group_id')->references('id')->on('product_groups');
            $table->float('area', '8', '2');
            $table->string('pack', '45');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}

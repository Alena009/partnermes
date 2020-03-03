<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInnerOuterOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inner_outer_orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedInteger('outer_order_position_id');
            $table->foreign('outer_order_position_id')->references('id')->on('orders_positions'); 
            $table->UnsignedInteger('inner_order_position_id');
            $table->foreign('inner_order_position_id')->references('id')->on('orders_positions');             
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
        Schema::dropIfExists('inner_outer_orders');
    }
}

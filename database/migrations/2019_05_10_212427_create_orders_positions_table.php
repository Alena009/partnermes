<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersPositionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders_positions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('kod', '45')->unique();            
            $table->UnsignedInteger('order_id');            
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->integer('amount');
            $table->dateTime('date_delivery');            
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
        Schema::dropIfExists('orders_positions');
    }
}

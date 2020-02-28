<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePalletsPositionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pallets_positions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedBigInteger('pallet_id');
            $table->foreign('pallet_id')->references('id')->on('pallets');              
            $table->UnsignedInteger('order_position_id');
            $table->foreign('order_position_id')->references('id')->on('orders_positions');     
            $table->integer('amount');
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
        Schema::dropIfExists('pallets_positions');
    }
}

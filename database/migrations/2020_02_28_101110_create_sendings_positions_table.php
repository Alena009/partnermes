<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSendingsPositionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sendings_positions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedBigInteger('sending_id');
            $table->foreign('sending_id')->references('id')->on('sendings');
            $table->UnsignedBigInteger('pallet_id');
            $table->foreign('pallet_id')->references('id')->on('pallets');            
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
        Schema::dropIfExists('sendings_positions');
    }
}

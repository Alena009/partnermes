<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->string('kod', '45')->unique();
            $table->string('name', '45');
            $table->UnsignedInteger('client_id');            
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            $table->dateTime('date_start');
            $table->dateTime('date_end');
            $table->string('description', '155');            
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
        Schema::dropIfExists('orders');
    }
}

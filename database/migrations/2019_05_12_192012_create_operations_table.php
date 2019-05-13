<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOperationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->increments('id');
            $table->UnsignedInteger('worker_id');            
            $table->foreign('worker_id')->references('id')->on('workers')->onDelete('cascade');
            $table->UnsignedInteger('order_position_id');            
            $table->foreign('order_position_id')->references('id')->on('orders_positions')->onDelete('cascade');
            $table->UnsignedInteger('task_id');            
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->integer('amount');
            $table->dateTime('date_start');
            $table->dateTime('date_end');            
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
        Schema::dropIfExists('operations');
    }
}

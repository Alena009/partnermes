<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeclaredWorksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('declared_works', function (Blueprint $table) {
            $table->bigIncrements('id');            
            $table->UnsignedInteger('order_position_id');            
            $table->foreign('order_position_id')->references('id')->on('orders_positions')->onDelete('cascade');
            $table->UnsignedInteger('task_id');            
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->integer('declared_amount');                        
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
        Schema::dropIfExists('declared_works');
    }
}

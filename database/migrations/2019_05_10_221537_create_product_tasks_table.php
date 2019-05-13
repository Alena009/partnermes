<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->UnsignedInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');
            $table->UnsignedInteger('task_id');
            $table->foreign('task_id')->references('id')->on('tasks');                        
            $table->integer('duration');
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
        Schema::dropIfExists('product_tasks');
    }
}

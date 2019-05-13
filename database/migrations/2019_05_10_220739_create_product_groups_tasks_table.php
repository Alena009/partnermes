<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductGroupsTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_groups_tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->UnsignedInteger('product_group_id');
            $table->foreign('product_group_id')->references('id')->on('product_groups');
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
        Schema::dropIfExists('product_groups_tasks');
    }
}

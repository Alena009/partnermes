<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTasksGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', '45');
            $table->UnsignedInteger('parent_id');
            $table->foreign('parent_id')->references('id')->on('tasks_groups');            
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
        Schema::dropIfExists('tasks_groups');
    }
}

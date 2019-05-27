<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaskGroupTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('task_group_translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedInteger('task_group_id');
            $table->foreign('task_group_id')->references('id')->on('tasks_groups')->onDelete('cascade');
            $table->string('locale')->index();
            $table->string('name');           
            $table->unique(['task_group_id','locale']);  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('task_group_translations');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCascadeDeletieToTheForeignKeysInTheProductGroupsTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_groups_tasks', function (Blueprint $table) {
            $table->dropForeign(['task_id']); 
            $table->unsignedInteger('task_id')->change();
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->dropForeign(['product_group_id']); 
            $table->unsignedInteger('product_group_id')->change();
            $table->foreign('product_group_id')->references('id')->on('product_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_groups_tasks', function (Blueprint $table) {
            //
        });
    }
}

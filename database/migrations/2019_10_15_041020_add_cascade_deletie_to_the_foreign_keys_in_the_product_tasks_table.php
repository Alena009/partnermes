<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCascadeDeletieToTheForeignKeysInTheProductTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_tasks', function (Blueprint $table) {
            $table->dropForeign(['product_id']); 
            $table->unsignedInteger('product_id')->change();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->dropForeign(['task_id']); 
            $table->unsignedInteger('task_id')->change();
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_tasks', function (Blueprint $table) {
            //
        });
    }
}

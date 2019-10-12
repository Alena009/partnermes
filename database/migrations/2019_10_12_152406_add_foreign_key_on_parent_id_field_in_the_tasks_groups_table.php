<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeyOnParentIdFieldInTheTasksGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tasks_groups', function (Blueprint $table) {
            $table->unsignedInteger('parent_id')->change();
            $table->foreign('parent_id')->references('id')->on('tasks_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks_groups', function (Blueprint $table) {
            //
        });
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnsListInTheOperationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('operations', function (Blueprint $table) {
            $table->dropForeign(['declared_work_id']);
            $table->dropColumn('declared_work_id');
            $table->unsignedInteger('order_position_id')->after('user_id');            
            $table->foreign('order_position_id')->references('id')->on('orders_positions')->onDelete('cascade');   
            $table->unsignedInteger('task_id')->after('order_position_id');
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
        Schema::table('operations', function (Blueprint $table) {
            //
        });
    }
}

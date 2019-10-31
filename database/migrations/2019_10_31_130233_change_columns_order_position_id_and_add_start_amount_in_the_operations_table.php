<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnsOrderPositionIdAndAddStartAmountInTheOperationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('operations', function (Blueprint $table) {
            $table->dropForeign(['order_position_id']);   
            $table->unsignedInteger('order_position_id')->nullable()->change();           
            $table->foreign('order_position_id')->references('id')->on('orders_positions')->onDelete('cascade');   
            $table->integer('start_amount')->after('task_id');  
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

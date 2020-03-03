<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCascadeDeleteToTheInnerOuterOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inner_outer_orders', function (Blueprint $table) {
            $table->dropForeign(['inner_order_position_id']); 
            $table->unsignedInteger('inner_order_position_id')->change();
            $table->foreign('inner_order_position_id')->references('id')->on('orders_positions')->onDelete('cascade');
            $table->dropForeign(['outer_order_position_id']); 
            $table->unsignedInteger('outer_order_position_id')->change();
            $table->foreign('outer_order_position_id')->references('id')->on('orders_positions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inner_outer_orders', function (Blueprint $table) {
            //
        });
    }
}

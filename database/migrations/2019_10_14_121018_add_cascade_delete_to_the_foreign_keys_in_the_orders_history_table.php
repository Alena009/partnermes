<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCascadeDeleteToTheForeignKeysInTheOrdersHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders_history', function (Blueprint $table) {
            $table->dropForeign(['order_id']); 
            $table->unsignedInteger('order_id')->change();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->dropForeign(['status_id']); 
            $table->unsignedInteger('status_id')->change();
            $table->foreign('status_id')->references('id')->on('statuses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders_history', function (Blueprint $table) {
            //
        });
    }
}

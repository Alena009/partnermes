<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropAmountStartStopInProductGroupsTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_groups_tasks', function (Blueprint $table) {
            $table->dropColumn('amount_start');
            $table->dropColumn('amount_stop');
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

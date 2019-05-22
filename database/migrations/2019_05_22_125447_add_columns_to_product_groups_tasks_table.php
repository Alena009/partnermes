<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToProductGroupsTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_groups_tasks', function (Blueprint $table) {
            $table->boolean('for_order')->after('duration')->default(false);
            $table->integer('amount_start')->after('for_order')->nullable();
            $table->integer('amount_stop')->after('amount_start')->nullable();
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
            $table->dropColumn('for_order');
            $table->dropColumn('amount_start');
            $table->dropColumn('amount_stop');
        });
    }
}

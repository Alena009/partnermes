<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetNullableDateAndAmountGiveInUsersToolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users_tools', function (Blueprint $table) {
            $table->integer('date_give')->nullable()->change();
            $table->integer('amount_give')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users_tools', function (Blueprint $table) {
            //
        });
    }
}

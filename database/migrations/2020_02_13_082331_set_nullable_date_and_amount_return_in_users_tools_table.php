<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetNullableDateAndAmountReturnInUsersToolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users_tools', function (Blueprint $table) {
            $table->integer('date_return')->nullable()->change();
            $table->integer('amount_return')->nullable()->change();
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

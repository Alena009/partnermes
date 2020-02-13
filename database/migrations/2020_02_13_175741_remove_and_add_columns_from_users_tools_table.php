<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveAndAddColumnsFromUsersToolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users_tools', function (Blueprint $table) {
            $table->dropColumn('date_give');
            $table->dropColumn('date_return');            
            $table->renameColumn('amount_give', 'type_operation');            
            $table->renameColumn('amount_return', 'amount');
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

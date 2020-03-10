<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCascadeDeleteToTheSendingsPositionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sendings_positions', function (Blueprint $table) {
            $table->dropForeign(['sending_id']); 
            $table->unsignedBigInteger('sending_id')->change();
            $table->foreign('sending_id')->references('id')->on('sendings')->onDelete('cascade');
            $table->dropForeign(['pallet_id']); 
            $table->unsignedBigInteger('pallet_id')->change();
            $table->foreign('pallet_id')->references('id')->on('pallets')->onDelete('cascade');            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sendings_positions', function (Blueprint $table) {
            //
        });
    }
}

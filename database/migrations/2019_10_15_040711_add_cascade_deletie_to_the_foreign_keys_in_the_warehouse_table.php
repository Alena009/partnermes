<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCascadeDeletieToTheForeignKeysInTheWarehouseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('warehouse', function (Blueprint $table) {
            $table->dropForeign(['product_id']); 
            $table->unsignedInteger('product_id')->change();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('warehouse', function (Blueprint $table) {
            //
        });
    }
}

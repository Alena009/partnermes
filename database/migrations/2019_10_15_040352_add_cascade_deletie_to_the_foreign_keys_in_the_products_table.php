<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCascadeDeletieToTheForeignKeysInTheProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['product_type_id']); 
            $table->unsignedInteger('product_type_id')->change();
            $table->foreign('product_type_id')->references('id')->on('product_types')->onDelete('cascade');
            $table->dropForeign(['product_group_id']); 
            $table->unsignedInteger('product_group_id')->change();
            $table->foreign('product_group_id')->references('id')->on('product_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
}

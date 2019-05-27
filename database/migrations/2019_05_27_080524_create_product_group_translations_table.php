<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductGroupTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_group_translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedInteger('product_group_id');
            $table->foreign('product_group_id')->references('id')->on('product_groups')->onDelete('cascade');
            $table->string('locale')->index();
            $table->string('name');           
            $table->unique(['product_group_id','locale']);   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_group_translations');
    }
}

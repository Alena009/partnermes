<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDepartamentTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('departament_translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedInteger('departament_id');
            $table->foreign('departament_id')->references('id')->on('departaments')->onDelete('cascade');
            $table->string('locale')->index();
            $table->string('name');           
            $table->unique(['departament_id','locale']);           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('departament_translations');
    }
}

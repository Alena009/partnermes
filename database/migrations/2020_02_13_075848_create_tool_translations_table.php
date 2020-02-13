<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateToolTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tool_translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedBigInteger('tool_id');
            $table->foreign('tool_id')->references('id')->on('tools')->onDelete('cascade');
            $table->string('locale')->index();
            $table->string('name');           
            $table->string('description');             
            $table->unique(['tool_id','locale']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tools_translations');
    }
}

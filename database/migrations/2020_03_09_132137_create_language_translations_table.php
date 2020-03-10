<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLanguageTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('language_translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedInteger('language_id');
            $table->foreign('language_id')->references('id')->on('language')->onDelete('cascade');
            $table->string('locale')->index();
            $table->string('name');     
            $table->string('short');             
            $table->unique(['language_id','locale']);   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('language_translations');
    }
}

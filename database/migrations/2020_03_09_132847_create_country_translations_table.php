<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCountryTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('country_translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedInteger('country_id');
            $table->foreign('country_id')->references('id')->on('country')->onDelete('cascade');
            $table->string('locale')->index();
            $table->string('name');                 
            $table->unique(['country_id','locale']);   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('country_translations');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUsersTools extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_tools', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->UnsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->UnsignedBigInteger('tool_id');
            $table->foreign('tool_id')->references('id')->on('tools'); 
            $table->dateTime('date_give');
            $table->dateTime('date_return');            
            $table->integer('amount_give');            
            $table->integer('amount_return');            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_tools');
    }
}

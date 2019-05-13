<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkerDepartamentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('worker_departaments', function (Blueprint $table) {
            $table->increments('id');
            $table->UnsignedInteger('worker_id');            
            $table->foreign('worker_id')->references('id')->on('workers')->onDelete('cascade');
            $table->UnsignedInteger('departament_id');            
            $table->foreign('departament_id')->references('id')->on('departaments')->onDelete('cascade');
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
        Schema::dropIfExists('worker_departaments');
    }
}

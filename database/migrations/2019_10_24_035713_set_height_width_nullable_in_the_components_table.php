<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetHeightWidthNullableInTheComponentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('components', function (Blueprint $table) {            
            $table->float('height', '8', '2')->nullable()->change();
            $table->float('width', '8', '2')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('components', function (Blueprint $table) {
            //
        });
    }
}

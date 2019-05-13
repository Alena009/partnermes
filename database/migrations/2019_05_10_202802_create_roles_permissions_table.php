<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRolesPermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roles_permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->UnsignedInteger('role_id');            
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->UnsignedInteger('permission_id');            
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
            $table->boolean('value');
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
        Schema::dropIfExists('roles_permissions');
    }
}

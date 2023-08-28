<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTiendasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tiendas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 400);
            $table->string('estado', 500);
            $table->string('municio', 500);
            $table->string('localidad', 500);
            $table->timestamps();

            $table->integer('user_id')->nullable()->unsigned();
            //relacion a la tabla usuarios
            $table->foreign('user_id')
                ->references('id')
                ->on('users')->nullOnDelete();

            $table->integer('categoria_id')->nullable()->unsigned();
            //relacion a la tabla categorias
            $table->foreign('categoria_id')
                ->references('id')
                ->on('categorias')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tiendas');
    }
}
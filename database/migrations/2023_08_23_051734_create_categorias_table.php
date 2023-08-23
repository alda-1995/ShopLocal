<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 400);
            $table->string('plural', 600);
            $table->boolean('estatus')->default(1);
            $table->integer('parent_id')->nullable()->unsigned();
            $table->timestamps();
        });
        Schema::table('categorias', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('categorias')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categorias');
    }
}

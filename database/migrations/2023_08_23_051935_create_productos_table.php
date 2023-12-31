<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 400);
            $table->mediumText('descripcion', 1200)->nullable();
            $table->decimal('precio', 10, 2);
            $table->timestamps();

            $table->integer('perfil_id')->unsigned();
            //relacion a la tabla perfil
            $table->foreign('perfil_id')
                ->references('id')
                ->on('perfils');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('productos');
    }
}

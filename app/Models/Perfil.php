<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_tienda',
        'descripcion',
        'estado',
        'municio',
        'localidad',
        'user_id',
        'categoria_id',
    ];
}

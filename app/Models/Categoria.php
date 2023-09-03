<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'plural',
        'estatus',
        'parent_id'
    ];

    use HasFactory;

    /**
     * obtiene la categoria padre
     */
    public function categoria_padre()
    {
        return $this->belongsTo(Categoria::class, 'parent_id');
    }
}

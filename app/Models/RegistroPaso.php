<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroPaso extends Model
{
    use HasFactory;

    protected $fillable = [
        'step_current',
        'user_id'
    ];
}

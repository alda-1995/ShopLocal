<?php

namespace App\Http\Controllers\V1\Post;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    /**
     * Show the application servicio.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('servicio.index');
    }
}

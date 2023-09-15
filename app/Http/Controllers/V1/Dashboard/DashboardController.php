<?php

namespace App\Http\Controllers\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\RegistroPaso;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $usuario = Auth::user();
        $categoriasPrincipales = Categoria::where('parent_id', "")->get();
        $stepRegister = RegistroPaso::where("user_id", $usuario->id)
        ->select('step_current')
        ->first();
        $stepCurrent = $stepRegister->step_current;
        return view('dashboard.index', compact('categoriasPrincipales', 'stepCurrent'));
    }
}

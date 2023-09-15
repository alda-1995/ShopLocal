<?php

namespace App\Http\Controllers\V1\Perfil;

use App\Http\Controllers\Controller;
use App\Models\Perfil;
use App\Models\RegistroPaso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PerfilController extends Controller
{
    public function register_one_step(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string',
        ]);
        $usuario = Auth::user();
        RegistroPaso::where("user_id", $usuario->id)->update(['step_current' => 'two_step']);
        Perfil::create($request->post());
        return redirect()->route('dashboard')->with('success', 'Se guardo correctamente la información');
    }
}

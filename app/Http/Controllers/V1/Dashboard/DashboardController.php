<?php

namespace App\Http\Controllers\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

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
        // $columns = [
        //     [
        //         'label' => 'Id',
        //         'field' => 'id'
        //     ],
        //     [
        //         'label' => 'Nombre',
        //         'field' => 'name'
        //     ],
        //     [
        //         'label' => 'Correo',
        //         'field' => 'email'
        //     ],
        //     [
        //         'label' => 'Acciones',
        //         'field' => 'action'
        //     ],
        // ];
        // $users = User::get();

        // $urlData = 'categorias';
        // $mensageExitoEliminar = "Se elimino correctamente el vendedor";
        // $mensageErrorEliminar = "Error al eliminar el vendedor";
        // return view('dashboard', compact('users', 'columns', 'urlData', 'mensageExitoEliminar', "mensageErrorEliminar"));
        return view('dashboard');
    }
}

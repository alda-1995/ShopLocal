<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $columns = [
            [
                'label' => 'Id',
                'field' => 'id'
            ],
            [
                'label' => 'Nombre',
                'field' => 'nombre'
            ],
            [
                'label' => 'Plural',
                'field' => 'plural'
            ],
            [
                'label' => 'Categoría principal',
                'field' => 'parent_id'
            ]
        ];
        $categorias = Categoria::with(['categoria_padre'])
        ->paginate(10);
        foreach ($categorias as $categoria) {
            $categoria->parent_id = $categoria->categoria_padre ? $categoria->categoria_padre->nombre : null;
        }
        return view('categorias.index', compact('columns', 'categorias'));
    }

    public function create()
    {
        $categorias = Categoria::all();
        return view('categorias.create', compact('categorias'));
    }

    /**
     * Store a new blog post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:400',
            'plural' => 'required|string|max:600',
            'parent_id' => 'sometimes|nullable|integer',
        ]);
        Categoria::create($request->post());
        return redirect()->route('categorias.index')->with('success', 'Se agrego correctamente la categoría.');
    }

    public function edit($id)
    {
        $categorias = Categoria::where('id', '!=', $id)->get();
        $categoria = Categoria::findOrFail($id);
        return view('categorias.edit', compact('categoria', 'categorias'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Categoria $categoria)
    {
        $request->validate([
            'nombre' => 'required|string|max:400',
            'plural' => 'required|string|max:600',
            'parent_id' => 'sometimes|nullable|integer',
        ]);
    
        $categoria->update($request->all());
    
        return redirect()->route('categorias.index')
                        ->with('success','Se actualizo correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $itemDelete = Categoria::find($id);
        $itemDelete->delete();
        return redirect()->route('categorias.index')->with('success', 'Se elimino correctamente la categoria.');
    }
}

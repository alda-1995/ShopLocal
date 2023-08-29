@extends('layouts.app')

@section('content')
    <x-layout.layout-form-crud title="Actualizar categoría">
        <form method="POST" action="{{ route('categorias.update', $categoria->id) }}" novalidate>
            @csrf
            @method('PUT')
            <x-forms.input label="Nombre" type="text" name="nombre" id="nombre" value="{{ $categoria->nombre }}" required
                autofocus />
            <x-forms.input label="Plural" type="text" name="plural" id="plural" value="{{ $categoria->plural }}"
                required autofocus />
            <x-forms.select id="categorySelect" name="parent_id" placeholder="Selecciona una categoria" :list="$categorias" :selected="$categoria->parent_id" />
            <x-buttons.btn-primary type="submit" label="Guardar" />
        </form>
    </x-layout.layout-form-crud>
@endsection

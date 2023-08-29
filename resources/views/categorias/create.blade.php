@extends('layouts.app')

@section('content')
    <x-layout.layout-form-crud title="Crear categoría">
        <form method="POST" action="{{ route('categorias.store') }}" novalidate>
            @csrf
            <x-forms.input label="Nombre" type="text" name="nombre" id="nombre" value="{{ old('nombre') }}" required
                autofocus />
            <x-forms.input label="Plural" type="text" name="plural" id="plural" value="{{ old('plural') }}" required
                autofocus />
            <x-forms.select name="parent_id" placeholder="Selecciona una categoria" :list="$categorias" :selected="old('parent_id')" />
            <x-buttons.btn-primary type="submit" label="Guardar" />
        </form>
    </x-layout.layout-form-crud>
@endsection

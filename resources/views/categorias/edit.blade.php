@extends('layouts.app')

@section('content')
    <x-layout.layout-form-crud title="Crear categoría">
        <form method="PUT" action="/categorias" novalidate>
            @csrf
            <x-forms.input label="Nombre" type="text" name="nombre" id="nombre" value="{{ old('nombre') }}" required
                autofocus />
            <x-forms.input label="Plural" type="text" name="plural" id="plural" value="{{ old('plural') }}" required
                autofocus />
            <x-buttons.btn-primary type="submit" label="Guardar" />
        </form>
    </x-layout.layout-form-crud>
@endsection

@extends('layouts.app')

@section('content')
    <x-layout.layout-form-center>
        @if (session('status'))
            <div class="alert alert-success" role="alert">
                {{ session('status') }}
            </div>
        @endif
        <form method="POST" action="{{ route('password.email') }}">
            @csrf
            <p class="text-primary parrafo mb-8">Ingresa el correo con el que te registraste</p>
            <x-forms.input label="Correo electronico" type="email" name="email" id="email" value="{{ old('email') }}"
                required autofocus />
            <x-buttons.btn-primary type="submit" label="Enviar" />
        </form>
    </x-layout.layout-form-center>
@endsection

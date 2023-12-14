@extends('layouts.app')

@section('content')
  <div class="min-h-screen pt-36 pb-24 bg-accent">
    <div class="container">
        {{-- <x-pages.perfil.register-step-one /> --}}
        {{-- <x-pages.perfil.register-step-two /> --}}
        <x-pages.perfil.register-step-three />
    </div>
  </div>
@endsection
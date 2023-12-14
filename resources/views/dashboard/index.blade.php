@extends('layouts.app')

@section('content')
  <div class="min-h-screen pt-36 pb-24 bg-accent">
    <div class="container">
      <x-pages.dashboard.info-servicios />
      <x-pages.dashboard.proceso-empty />
    </div>
  </div>
@endsection

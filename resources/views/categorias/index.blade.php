@extends('layouts.app')
@section('content')
    <div class="py-24 md:py-28 lg:py-32 min-h-screen">
        <div class="container">
            @if ($message = Session::get('success'))
                <div class="alert alert-success">
                    <p>{{ $message }}</p>
                </div>
            @endif
            <x-forms.datatable :rows="$categorias"
            msgConfirm=""
            urlData="categorias" :columns="$columns" />
        </div>
    </div>
@endsection

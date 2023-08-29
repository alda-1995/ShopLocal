@extends('layouts.app')
@section('content')
    <div class="py-24 md:py-28 lg:py-32 min-h-screen">
        <div class="container">
            @if ($message = Session::get('success'))
                <x-forms.alert class="bg-success-100 text-success-700">
                    {{ $message }}
                </x-forms.alert>
            @endif
            <x-forms.datatable :rows="$categorias"
            msgConfirm=""
            urlData="categorias" :columns="$columns" />
        </div>
    </div>
@endsection

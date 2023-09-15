@extends('layouts.app')

@section('content')
    @if ($stepCurrent == 'one_step')
        <x-forms.register-step-one />
    @endif
    @if ($stepCurrent == 'two_step')
        <x-forms.register-step-two />
    @endif
    @if ($stepCurrent == 'three_step')
        <x-forms.register-step-three />
    @endif
@endsection

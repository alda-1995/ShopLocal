@extends('layouts.app-home')

@section('content')
    <div class="min-h-screen pt-36 pb-24 bg-accent">
        <div class="container">
            <div class="text-neutral mb-8">
                <h2 class="">Servicios</h2>
            </div>
            <div class="grid grid-cols-1 gap-4 md:gap-6 lg:gap-12 sm:grid-cols-2 md:grid-cols-3">
                <x-cards.card-publicar title="Servicios domésticos"
                    text=" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur, ipsa." />
                <x-cards.card-publicar title="Mantenimiento y reparaciones"
                    text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur, ipsa." />
                <x-cards.card-publicar title="Tecnología"
                    text=" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur, ipsa." />
                <x-cards.card-publicar title="Salud y cuidado médico"
                    text=" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur, ipsa." />
                <x-cards.card-publicar title="Educación"
                    text=" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur, ipsa." />
                <x-cards.card-publicar title="Otros"
                    text=" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur, ipsa." />
            </div>
        </div>
    </div>
@endsection

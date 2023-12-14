@extends('layouts.app')

@section('content')
    <x-layout.layout-form urlImg="img/login-person.svg">
        <form method="POST" action="{{ route('register') }}" novalidate>
            @csrf
            <!--Sign in section-->
            <div class="flex flex-row items-center justify-center lg:justify-start">
                <p class="mb-0 mr-4 parrafo">Inicia sesión con</p>
                <!-- Facebook -->
                <a href="{{ url('/login-facebook') }}"
                    class="inline-flex justify-center items-center mx-1 h-9 w-9 rounded-full bg-primary uppercase
                    text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
                    focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700
                    active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                    <!-- Facebook -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                </a>
                <!-- Google -->
                <a href="{{ url('/login-google') }}"
                    class="inline-flex justify-center items-center mx-1 h-9 w-9 rounded-full bg-white uppercase
                    text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                    focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700
                    active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                    <!-- Google -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 48 48">
                        <defs>
                            <path id="a"
                                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                        </defs>
                        <clipPath id="b">
                            <use xlink:href="#a" overflow="visible" />
                        </clipPath>
                        <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                        <path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                        <path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                        <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                    </svg>
                </a>
            </div>
            <!-- Separator between social media sign in and email/password sign in -->
            <div
                class="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p class="mx-4 mb-0 text-center parrafo">
                    O
                </p>
            </div>
            <x-forms.input label="Nombre completo" placeholder="Escribe tu nombre completo" type="text" name="name" id="name" value="{{ old('name') }}"
                required autofocus />
            <x-forms.input label="Correo electronico" placeholder="correo@ejemplo.com" type="email" name="email" id="email"
                value="{{ old('email') }}" required autofocus />
            <x-forms.input type="password" name="password" label="Contraseña" placeholder="Escribe una contraseña con al menos 8 caracteres" value="{{ old('password') }}" required
                autofocus />
            <x-forms.input type="password" name="password_confirmation" placeholder="Repite la misma contraseña" label="Confirmar contraseña"
                value="{{ old('password_confirmation') }}" required autofocus />
            <x-buttons.btn-primary type="submit" label="Registrarme" />
        </form>
    </x-layout.layout-form>
@endsection

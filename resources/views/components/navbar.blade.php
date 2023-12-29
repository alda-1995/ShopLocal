<!-- Navbar -->
<nav id="main-navbar"
    class="
    {{ auth()->check() ? 'bg-white' : '' }}
    fixed left-0 right-0 top-0 z-[100] flex w-full flex-nowrap h-[90px] items-center justify-between">
    <div class="container">
        <div
            class="w-full {{ auth()->check() && !request()->is('/') && !request()->is('servicios') ? 'xl:pl-64' : '' }}">
            <div class="flex w-full flex-wrap justify-between items-center">
                <a class="text-primary inline-flex items-center h4"
                    href="{{ url('/') }}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                    <span class="inline-block ml-4">LocalShop</span>
                </a>
                <div class="hidden lg:block px-4">
                    <ul class="list-none flex gap-12">
                        <li>
                            <x-buttons.link-menu url="servicios" label="Locales" />
                        </li>
                        <li>
                            <x-buttons.link-menu url="servicios" label="Servicios" />
                        </li>
                        <li>
                            <x-buttons.link-menu url="servicios" label="Productos" />
                        </li>
                    </ul>
                </div>
                <ul class="list-none flex gap-8 items-center">
                    @guest
                        @if (Route::has('login'))
                            <li>
                                <x-buttons.link-secondary url="login" label="Iniciar sesión" />
                            </li>
                        @endif
                        @if (Route::has('register'))
                            <li>
                                <x-buttons.link-primary url="register" label="Registrarme" />
                            </li>
                        @endif
                    @else
                        <li class="relative">
                            <button aria-expanded="false" data-dropdown-toggle="dropdown-user" type="button"
                                class="bg-neutral text-white cursor-pointer flex justify-center items-center rounded-full h-[54px] w-[54px] h4">
                                ARS
                            </button>
                            <div class="absolute hidden right-0 z-50 my-4 list-none 
                        bg-white divide-y min-w-[12rem] divide-gray-100 rounded shadow"
                                id="dropdown-user">
                                <ul>
                                    <li>
                                        <x-buttons.link-submenu label="Mi perfil" url="perfil">
                                            <x-slot name="icon">
                                                <svg class="stroke-primary w-6 h-6 transition-all duration-300 group-hover/link:stroke-white"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </x-slot>
                                        </x-buttons.link-submenu>
                                    </li>
                                    <li>
                                        <x-buttons.link-submenu label="Salir" url="logout" id="btnLogout">
                                            <x-slot name="icon">
                                                <svg class="stroke-primary w-6 h-6 transition-all duration-300 group-hover/link:stroke-white"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                                </svg>
                                            </x-slot>
                                            <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                                class="hidden">
                                                @csrf
                                            </form>
                                        </x-buttons.link-submenu>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    @endguest
                </ul>
            </div>
        </div>
    </div>
</nav>
<!-- Navbar -->

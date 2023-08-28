<!-- Navbar -->
<nav id="main-navbar"
    class="fixed left-0 right-0 top-0 z-[9999] flex w-full flex-nowrap h-[80px] items-center justify-between"
    data-te-navbar-ref>
    <div class="container">
        <div class="w-full {{ auth()->check() ? 'xl:pl-64' : '' }}">
            <div class="flex w-full flex-wrap justify-between">
                <a class="@if (request()->is('login') || request()->is('register') || request()->is('password/reset')) text-primary 
                @else text-white @endif inline-flex items-center h4"
                    href="{{ url('/') }}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                    <span class="inline-block ml-4">LocalShop</span>
                </a>
                <!-- Toggler -->
                <button data-te-sidenav-toggle-ref data-te-target="#sidenav-1"
                    class="block border-0 bg-transparent px-2.5 text-white hover:no-underline
                    hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 xl:hidden"
                    aria-controls="#sidenav-1" aria-haspopup="true">
                    <span class="block [&>svg]:h-10 [&>svg]:w-10 [&>svg]:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                            <path fill-rule="evenodd"
                                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                clip-rule="evenodd" />
                        </svg>
                    </span>
                </button>
                <!-- Right links -->
                <ul class="hidden xl:flex relative items-center">
                    @guest
                        <div class="flex gap-6">
                            @if (Route::has('login'))
                                <x-buttons.link-primary url="login" label="Iniciar sesión" />
                            @endif
                            @if (Route::has('register'))
                                <x-buttons.link-secondary url="register" label="Registrarme" />
                            @endif
                        </div>
                    @else
                        <li class="relative group">
                            <button
                                class="bg-white flex items-center justify-center
                            rounded-full h-[50px] w-[50px] shadow-lg">
                                <img src="https://tecdn.b-cdn.net/img/Photos/Avatars/img (31).webp" class="rounded-full"
                                    style="height: 40px; width: 40px" alt="Avatar" loading="lazy" />
                            </button>
                            <div
                                class="absolute left-auto right-0 z-[1000] 
                            hidden group-hover:block min-w-[10rem] pt-2">
                                <ul
                                    class="list-none overflow-hidden border-none 
                                bg-clip-padding text-left bg-white w-full rounded-lg">
                                    <li>
                                        <a class="flex items-center w-full whitespace-nowrap bg-transparent px-4 py-[0.8rem]
                                        transition-all duration-300
                                        btn-font text-primary hover:bg-primary hover:text-white group/link"
                                            href="#">
                                            <div class="flex mr-1">
                                                <svg class="stroke-primary w-6 h-6 transition-all duration-300 group-hover/link:stroke-white"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            Mi perfil
                                        </a>
                                    </li>
                                    <li>
                                        <a class="flex items-center w-full whitespace-nowrap bg-transparent px-4 py-[0.8rem] btn-font
                                        text-primary hover:bg-primary hover:text-white group/link"
                                            href="{{ route('logout') }}"
                                            onclick="event.preventDefault();
                                document.getElementById('logout-form').submit();">
                                            <div class="flex mr-1">
                                                <svg class="stroke-primary w-6 h-6 transition-all duration-300 group-hover/link:stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                                  </svg>                                                  
                                            </div>
                                            Salir
                                            <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                                class="hidden">
                                                @csrf
                                            </form>
                                        </a>
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

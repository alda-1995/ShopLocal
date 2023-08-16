<!-- Navbar -->
<nav id="main-navbar"
    class="fixed left-0 right-0 top-0 flex w-full flex-nowrap h-[80px] items-center justify-between bg-white py-[0.6rem] text-gray-500 shadow-lg"
    data-te-navbar-ref>
    <!-- Container wrapper -->
    <div class="w-full {{ auth()->check() ? 'xl:pl-64' : '' }}">
        <div class="flex w-full flex-wrap justify-between px-4 lg:px-12">
            <a class="inline-block" href="{{ url('/') }}">
                <img src="{{ asset('images/logo.png') }}" class="max-w-[60px]" alt="Logo">
            </a>
            <!-- Toggler -->
            <button data-te-sidenav-toggle-ref data-te-target="#sidenav-1"
                class="block border-0 bg-transparent px-2.5 text-gray-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 xl:hidden"
                aria-controls="#sidenav-1" aria-haspopup="true">
                <span class="block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                        <path fill-rule="evenodd"
                            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                            clip-rule="evenodd" />
                    </svg>
                </span>
            </button>
            <!-- Right links -->
            <ul class="relative flex items-center">
                @guest
                    <div class="flex gap-6">
                        @if (Route::has('login'))
                            <x-forms.link-primary label="Iniciar sesión" link="{{ route('login') }}" />
                        @endif
                        @if (Route::has('register'))
                            <x-forms.link-secondary label="Registro" link="{{ route('register') }}" />
                        @endif
                    </div>
                @else
                    <li class="relative" data-te-dropdown-ref>
                        <a class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
                            href="#" id="navbarDropdownMenuLink" role="button" data-te-dropdown-toggle-ref
                            aria-expanded="false">
                            <img src="https://tecdn.b-cdn.net/img/Photos/Avatars/img (31).webp" class="rounded-full"
                                style="height: 40px; width: 40px" alt="Avatar" loading="lazy" />
                        </a>
                        <ul class="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-[10rem] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-zinc-700 [&[data-te-dropdown-show]]:block"
                            aria-labelledby="dropdownMenuButton2" data-te-dropdown-menu-ref>
                            <li>
                                <a class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                                    href="#" data-te-dropdown-item-ref>Mi perfil</a>
                            </li>
                            <li>
                                <a class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-white/30"
                                    href="{{ route('logout') }}"
                                    onclick="event.preventDefault();
                        document.getElementById('logout-form').submit();"
                                    data-te-dropdown-item-ref>
                                    Salir
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>
                                </a>
                            </li>
                        </ul>
                    </li>
                @endguest
            </ul>
        </div>
    </div>
    <!-- Container wrapper -->
</nav>
<!-- Navbar -->

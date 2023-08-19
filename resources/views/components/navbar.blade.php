<!-- Navbar -->
<nav id="main-navbar" class="fixed left-0 right-0 top-0 flex w-full flex-nowrap h-[80px] items-center justify-between"
    data-te-navbar-ref>
    <div class="container">
        <div class="w-full {{ auth()->check() ? 'xl:pl-64' : '' }}">
            <div class="flex w-full flex-wrap justify-between px-4 lg:px-12">
                <a class="inline-flex items-center text-white h4" href="{{ url('/') }}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                    <span class="inline-block ml-4">LocalShop</span>
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
                            <ul class="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-[10rem] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg [&[data-te-dropdown-show]]:block"
                                aria-labelledby="dropdownMenuButton2" data-te-dropdown-menu-ref>
                                <li>
                                    <a class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400"
                                        href="#" data-te-dropdown-item-ref>Mi perfil</a>
                                </li>
                                <li>
                                    <a class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400"
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
    </div>
</nav>
<!-- Navbar -->

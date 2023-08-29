<!-- Sidenav -->
<nav id="sidenav-1"
    class="fixed left-0 top-0 z-[1035] h-screen w-60 -translate-x-full 
    overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)]
    xl:data-[te-sidenav-hidden='false']:translate-x-0"
    data-te-sidenav-init data-te-sidenav-hidden="false" data-te-sidenav-mode-breakpoint-over="0"
    data-te-sidenav-mode-breakpoint-side="xl" data-te-sidenav-content="#content" data-te-sidenav-accordion="true">
    <div class="px-6">
        <a class="mb-3 flex items-center py-6 outline-none h4 text-primary" href="#!" data-te-ripple-init
            data-te-ripple-color="primary">
            <span class="inline-block">Menú</span>
        </a>
        <span class="block small uppercase text-neutral mb-2">Crear</span>
        <ul class="relative m-0 list-none px-[0.2rem] pb-6" data-te-sidenav-menu-ref>
            {{-- <li class="relative">
                <x-menu.link-item url="/" text="Usuarios">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="h-5 w-5 transition 
                    duration-300 ease-linear">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </x-menu.link-item>
            </li> --}}
            <li class="relative">
                <x-menu.link-item url="categorias.create" text="Categorias">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="h-5 w-5 transition 
                    duration-300 ease-linear">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </x-menu.link-item>
            </li>
            {{-- <li class="relative">
                <x-menu.link-item url="/" text="Productos">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="h-5 w-5 transition 
                    duration-300 ease-linear">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </x-menu.link-item>
            </li> --}}
        </ul>
        <span class="block small uppercase text-neutral mb-2">Administrar</span>
        <ul class="relative m-0 list-none px-[0.2rem] pb-6" data-te-sidenav-menu-ref>
            {{-- <x-menu.link-item url="/" text="Usuarios">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5 transition 
                    duration-300 ease-linear">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            </x-menu.link-item> --}}
            <x-menu.link-item url="categorias.index" text="Categorías">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5 transition 
                    duration-300 ease-linear">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                </svg>
            </x-menu.link-item>
            {{-- <x-menu.link-item url="/" text="Productos">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-5 w-5 transition 
                    duration-300 ease-linear">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </x-menu.link-item> --}}
        </ul>
    </div>
</nav>
<!-- Sidenav -->

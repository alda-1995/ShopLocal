@props(['url' => '/', 'text' => ''])
<a 
href="{{ route($url) }}"
class="flex cursor-pointer items-center truncate px-2 py-[0.45rem]
btn-font text-neutral outline-none transition 
duration-300 ease-linear hover:bg-accent
hover:text-white hover:outline-none focus:bg-accent
focus:text-white focus:outline-none active:bg-accent
active:text-white active:outline-none
data-[te-sidenav-state-active]:text-white group
data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none rounded-[5px]"
    data-te-sidenav-link-ref>
    <span class="mr-4 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-neutral group-hover:[&>svg]:text-white">
        {{ $slot }}
    </span>
    <span>{{$text}}</span>
</a>
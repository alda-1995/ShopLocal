@props(['img', 'title' => '', 'url' => ''])
<a href="{{ $url }}" class="flex flex-col items-center text-center group">
    <div class="w-full h-[150px] md:h-[300px] relative">
        @if (isset($img))
            <div class="bg-cover bg-center bg-no-repeat w-full h-full"
                style="background-image: url('{{ $img }}');">
            </div>
        @else
            <div class="w-full h-full flex items-center justify-center">
                <h4 class="text-primary parrafo">No disponible</h4>
            </div>
        @endif
        <div class="transition-opacity duration-150 opacity-0 group-hover:opacity-100
        top-0 left-0 absolute h-full w-full flex justify-center items-center bg-yellow-opacity">
            <div class="text-white flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-10 h-10">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
        </div>
    </div>
    <p class="text-main parrafo mt-4">{{ $title }}</p>
</a>

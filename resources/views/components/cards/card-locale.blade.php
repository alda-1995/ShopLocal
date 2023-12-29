@props(['img', 'title' => '', 'text' => '', 'direccion' => '', 'url' => '', 'typeClass' => ''])
<a href="{{ $url }}" class="flex flex-col rounded-lg p-6 md:py-8 {{ $typeClass }}">
    <div class="h-[150px] md:h-[200px] rounded-lg mb-4">
        @if ($img)
            <div class="rounded-lg bg-cover bg-center bg-no-repeat w-full h-full"
                style="background-image: url('{{ $img }}');">
            </div>
        @else
            <div class="bg-base-100 opacity-80 rounded-lg h-full w-full"></div>
        @endif
    </div>
    <div class="flex flex-col md:flex-row mt-4">
        <div class="md:pr-6">
            <h3 class="text-neutral flex-1">{{ $title }}</h3>
            <p class="small text-base-200 mt-2">{{ $text }}</p>
            @if($direccion)
            <p class="big-small mt-2">Direccion: {{ $direccion }}</p>
            @endif
        </div>
        <div class="shrink-0">
            <x-buttons.btn-rounded typeClass="black-btn" />
        </div>
    </div>
</a>

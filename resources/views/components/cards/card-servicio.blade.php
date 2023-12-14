@props(['img', 'title' => '', 'text' => '', 'url' => '', 'oferta' => ''])
<a href="{{ $url }}" class="flex flex-col">
    <div class="w-full rounded-xl mb-4 h-[200px] md:h-[250px] relative">
        @if ($oferta)
            <div class="absolute top-4 max-w-[200px] right-0 inline-flex rounded-xl small bg-red-500 text-white p-4">
                Descuento {{$oferta}}%
            </div>
        @endif
        @if (isset($img))
            <img src="{{ $img }}" class="rounded-xl h-full w-full object-cover" alt="">
        @else
            <div class="bg-primary h-full w-full"></div>
        @endif
    </div>
    @if ($title)
        <h3 class="text-neutral mb-2">{{ $title }}</h3>
    @endif
    @if ($text)
        <p class="text-neutral small font-light">{{ $text }}</p>
    @endif
    <div class="mt-6">
        <x-buttons.btn-primary label="Conocer más" />
    </div>
</a>

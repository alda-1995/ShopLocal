{{-- @props(['img', 'title' => '', 'text' => '', 'precio' => '', 'url' => '', 'typeClass' => ''])
<a href="{{ $url }}" class="flex flex-col rounded-lg p-6 md:py-8 {{ $typeClass }}">
    <div class="h-[150px] md:h-[200px] flex items-center justify-center rounded-lg mb-4">
        @if ($img)
            <img src="{{ $img }}" class="max-h-full object-contain" alt="img ropa">
        @else
            <img src="{{ $img }}" class="max-h-full object-contain" alt="img ropa">
        @endif
    </div>
    <div class="flex flex-col md:flex-row mt-4">
        <div class="md:pr-6">
            <h3 class="text-white">{{ $title }}</h3>
            <p class="small text-white mt-2">{{ $text }}</p>
            <p class="small text-white mt-2">{{ $precio }}</p>
        </div>
        <div class="shrink-0">
            <x-buttons.btn-rounded typeClass="black-btn" />
        </div>
    </div>
</a> --}}

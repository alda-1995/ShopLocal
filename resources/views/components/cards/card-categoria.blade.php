@props(['img', 'title' => '', 'text' => '', 'url' => ''])
<a href="{{$url}}" class="flex flex-col rounded-lg p-6">
    <div class="h-[90px] md:h-[110px] w-[90px] md:w-[110px] rounded-full mb-4">
        @if ($img)
            <div class="rounded-full bg-cover bg-center bg-no-repeat w-full h-full"
                style="background-image: url('{{ $img }}');">
            </div>
        @else
            <div class="bg-primary rounded-full h-full w-full"></div>
        @endif
    </div>
    <div class="flex flex-col md:flex-row mt-4">
        <div class="md:pr-6">
            <h3 class="text-neutral">{{ $title }}</h3>
            <p class="small text-base-200 mt-2">{{ $text }}</p>
        </div>
        <div class="shrink-0">
            <x-buttons.btn-rounded />
        </div>
    </div>
</a>

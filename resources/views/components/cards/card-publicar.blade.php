@props(['img', 'title' => '', 'text' => '', 'url' => ''])
<a href="{{ $url }}" class="flex flex-col bg-white rounded-xl p-6 md:px-12 md:py-8">
    @if ($title)
        <h3 class="text-neutral mb-4 flex-1">{{ $title }}</h3>
    @endif
    @if ($text)
        <p class="text-neutral small font-light">{{ $text }}</p>
    @endif
    <div class="mt-4 md:mt-6">
        <x-buttons.btn-rounded />
    </div>
</a>

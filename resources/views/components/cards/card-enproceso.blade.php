@props(['title' => '', 'text' => '', 'estatus' => '', 'url' => ''])
<a href="{{ $url }}" class="flex flex-col md:flex-row py-4 border-b border-gray-300">
    <div class="flex flex-col flex-1 md:pr-16">
        @if ($title)
            <h3 class="text-neutral mb-4">{{ $title }}</h3>
        @endif
        @if ($text)
            <p class="text-neutral small font-light">{{ $text }}</p>
        @endif
    </div>
    <div class="flex-shrink-0">
        @if ($estatus === 'aprobado')
            <div class="bg-green-500 min-w-[120px] text-center text-white parrafo p-4 rounded-xl">
                Aprobado
            </div>
        @elseif ($estatus === 'pendiente')
            <div class="bg-yellow-500 min-w-[120px] text-center text-white parrafo p-4 rounded-xl">
                Pendiente
            </div>
        @elseif ($estatus === 'cancelado')
            <div class="bg-red-500 min-w-[120px] text-center text-white parrafo p-4 rounded-xl">
                Cancelado
            </div>
        @endif
    </div>
</a>

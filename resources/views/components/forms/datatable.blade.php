<div class="flex flex-col">
    <div class="flex justify-end mb-4">
        <x-buttons.btn-create url="{{ route('categorias.create') }}" label="Crear" />
    </div>
    <div class="rounded border border-neutral-700">
        <div class="p-2 md:p-4">
            <table class="table-auto w-full mt-4">
                <thead class="small">
                    <tr>
                        @foreach ($columns as $column)
                            <th class="border-b px-4 py-3">{{ $column['label'] }}</th>
                        @endforeach
                        <th class="px-4 py-3 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody class="parrafo">
                    @php
                        $counter = 0;
                    @endphp
                    @foreach ($rows as $row)
                        @php
                            $counter++;
                        @endphp
                        <tr>
                            @foreach ($columns as $column)
                                @if ($column['field'] == 'id')
                                    <td class="border-b px-4 py-2">{{ $counter }}</td>
                                @else
                                    <td class="border-b px-4 py-2">{{ $row->{$column['field']} }}</td>
                                @endif
                            @endforeach
                            <td class="border-b px-4 py-2">
                                <div class="flex items-center gap-4">
                                    <a href="{{ route($urlData . '.edit', $row->id) }}" class="inline-block text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                        </svg>
                                    </a>
                                    <form action="{{ route($urlData . '.destroy', $row->id) }}" method="POST" data-message="¿Estas seguro de eliminar?'"
                                        class="inline-flex form-confirms" name="deleteForm">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-red-500 hover:text-red-700 ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    @if ( $rows->total() > 0 )
    <div class="flex flex-col md:flex-row md:justify-end md:items-center small gap-4 mt-4">
        <div class="md:max-w-[30%]">
            <p class="text-neutral">
                Total de {{ $rows->total() }} registros
            </p>
        </div>
        @if ( $rows->total() >= 10 )
        <div class="flex items-center gap-2">
            {{-- Enlaces de paginación numérica --}}
            <span class="mr-2">Página:</span>
            @php
                $urlPreviousPage = $rows->previousPageUrl();
            @endphp
            <x-buttons.btn-paginador :url="$urlPreviousPage"
                class="{{ $rows->currentPage() > 1 ? '' : 'opacity-50 pointer-events-none' }}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
            </x-buttons.btn-paginador>

            @for ($i = 1; $i <= $rows->lastPage(); $i++)
                <a href="{{ $rows->url($i) }}"
                    class="px-2 py-1 rounded inline-flex
                    hover:bg-secondary hover:text-white
                    {{ $rows->currentPage() === $i ? 'bg-primary text-white' : '' }}">{{ $i }}</a>
            @endfor
            @php
                $urlNextPage = $rows->hasMorePages() ? $rows->nextPageUrl() : '';
            @endphp
            <x-buttons.btn-paginador :url="$urlNextPage"
                class="{{ $rows->hasMorePages() ? '' : 'opacity-50 pointer-events-none' }}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
            </x-buttons.btn-paginador>
        </div>
        @endif
    </div>
    @endif
</div>

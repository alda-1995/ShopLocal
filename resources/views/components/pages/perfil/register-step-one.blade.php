<x-layout.layout-form-crud>
    <h3 class="mb-4 text-neutral">Vamos a empezar</h3>
    <p class="mb-8 small text-neutral">Por favor, elija la localidad a la que perteneces.</p>
    <form method="POST" action="{{ route('created_one_step') }}" novalidate>
        @csrf
        <div class="flex flex-col md:flex-row gap-4 md:gap-8">
            <x-controls.radio-control value="ahuatepec" label="Ahuatepec" name="localidad" />
            <x-controls.radio-control value="hueyotlipan" label="Santo Tomas Hueyotlipan" name="localidad" />
        </div>
        @if ($errors->any())
            <x-forms.alert class="bg-red-500 text-white">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </x-forms.alert>
        @endif
        <div class="mt-4">
            <x-buttons.btn-primary type="submit" label="Siguiente" />
        </div>
    </form>
</x-layout.layout-form-crud>

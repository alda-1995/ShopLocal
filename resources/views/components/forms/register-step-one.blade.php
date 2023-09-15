<x-layout.layout-form-crud title="">
    <h4 class="mb-4 text-secondary">¿Que te gustaria dar a conocer?(Paso 1)</h4>
    <p class="mb-8 small text-neutral">Por favor, elija si desea proporcionar un servicio o local de venta.</p>
    <form method="POST" action="{{ route('created_one_step') }}" novalidate>
        @csrf
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <x-controls.radio-card value="restaurante" title="Restaurante" img="img/local.png" name="tipo" />
            <x-controls.radio-card value="servicio" title="Servicio" img="img/servicio.png" name="tipo" />
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
        <x-buttons.btn-primary type="submit" label="Siguiente" />
    </form>
</x-layout.layout-form-crud>

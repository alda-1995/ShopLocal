<x-layout.layout-form-crud>
    <h4 class="mb-8 text-neutral">Para finalizar el registro, requerimos algunos datos personales adicionales.</h4>
    <form method="POST" action="{{ route('categorias.store') }}" novalidate>
        @csrf
        <x-forms.input infoRequired={{false}} label="Local" placeholder="Escribe el nombre del local" 
        type="text" name="local" id="local" value="{{ old('local') }}"
        autofocus />
        <x-forms.input infoRequired={{false}} label="Dirección" placeholder="Escribe tu dirección" 
        type="text" name="direccion" id="direccion" value="{{ old('direccion') }}"
        autofocus />
        <x-controls.input-phone infoRequired={{false}} label="Celular" type="text" name="celular" id="celular"
        value="{{ old('celular') }}" autofocus placeholder="(222) 222-2222" />
        <div class="mt-6">
            <x-buttons.btn-primary type="submit" label="Siguiente" />
        </div>
    </form>
</x-layout.layout-form-crud>
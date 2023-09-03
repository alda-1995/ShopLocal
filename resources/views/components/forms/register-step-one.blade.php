<x-layout.layout-form-crud title="">
    <h4 class="mb-4 text-secondary">Categoría del Servicio o Local(Paso 1)</h4>
    <p class="mb-8 small text-neutral">Por favor, selecciona la categoria que se ajuste mejor a tu servicio o local:</p>
    <form method="POST" action="{{ route('categorias.store') }}" novalidate>
        @csrf
        <x-forms.select name="categoria" placeholder="Selecciona una categoría" :selected="old('estado')" />
        <x-buttons.btn-primary type="submit" label="Siguiente" />
    </form>
</x-layout.layout-form-crud>

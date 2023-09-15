<x-layout.layout-form-crud title="">
    <h4 class="mb-4 text-secondary">Información personal(Paso 3)</h4>
    <p class="mb-8 small text-neutral">Por favor, complete la siguiente información:</p>
    <form method="POST" action="{{ route('categorias.store') }}" novalidate>
        @csrf
        <x-forms.input label="Nombre del local"
        type="text" name="nombre" id="nombre" value="{{ old('nombre') }}" 
        autofocus infoRequired />
        <p class="small mb-2 text-gray-500 text-[12px]">Describe tu servicios o tu local en pocas palabras.</p>
        <x-forms.text-area label="Descripción" type="text" name="descripcion" id="descripcion" value="{{ old('plural') }}" required
            autofocus />
        <x-forms.select name="estado" placeholder="Estado" :selected="old('estado')" />
        <x-forms.input label="Municipio"
        type="text" name="municio" id="municio" value="{{ old('municio') }}" />
        <x-buttons.btn-primary type="submit" label="Siguiente" />
    </form>
</x-layout.layout-form-crud>

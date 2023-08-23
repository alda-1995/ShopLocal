<div class="flex flex-col">
    <div class="flex justify-end mb-4">
        <x-buttons.btn-create url="{{ route('categorias.create') }}" label="Crear" />
    </div>
    <div id="tbcrud"></div>
</div>

@push('js_after')
    <script type="module">
        var columnsData = {!! json_encode($columns) !!};
        var rowsData = {!! json_encode($rows) !!};
        var urlData = {!! json_encode($urlData) !!};
        var msgConfirm = {!! json_encode($msgConfirm) !!};
        TableCreateMe(columnsData, rowsData, urlData, "tbcrud", msgConfirm);
    </script>
@endpush

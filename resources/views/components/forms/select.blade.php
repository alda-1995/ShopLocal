@props(['list' => [], 'id' => '', 'name' => '', 'placeholder' => '', 'selected' => null])
<div class="flex-col btn-font text-primary {{ $errors->has($name) ? 'mb-2' : 'mb-6' }} select-me">
    <select id="{{ $id }}" data-te-select-init data-te-select-filter="true" data-te-select-size="lg"
        data-te-select-placeholder="{{ $placeholder }}" name="{{ $name }}">
        @foreach ($list as $item)
            <option value="{{ $item->id }}">
                {{ $item->nombre }}
            </option>
        @endforeach
    </select>
    @error($name)
        <span class="block text-red-400 mb-4 small" role="alert">
            <strong>{{ $message }}</strong>
        </span>
    @enderror
</div>

@push('js_after')
    <script type="module">
        var idSelect = {!! json_encode($id) !!};
        var valueDefault = {!! json_encode($selected) !!};
        const singleSelect = document.querySelector("#"+idSelect);
        const singleSelectInstance = Select.getInstance(singleSelect);
        singleSelectInstance.setValue(String(valueDefault));
    </script>
@endpush

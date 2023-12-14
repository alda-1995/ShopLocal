@props(['name' => '', 'id' => '', 'value' => '', 'placeholder' => '', 'required' => false, 
'type' => '', 'label' => '', 'autofocus' => false, 'infoRequired' => false])
<div class="flex flex-col mb-4">
    @if (isset($infoRequired))
    <div class="flex justify-end">
        <p class="small mb-2 text-gray-500 text-[12px]">{{ $infoRequired ? '(Requerido)' : '(Opcional)' }}</p>
    </div>
    @endif
    <label for="{{ $name }}" class="block mb-2 btn-font text-primary">{{ $label }}</label>
    <input type="{{ $type }}" id="{{ $name }}" name="{{ $name }}" id="{{ $name }}"
        class="bg-white border-[2px] border-gray-200 text-primary 
        text-sm rounded-lg focus:ring-primary outline-none
        focus:border-primary block w-full btn-font phone-mask
        p-2.5  @error($name) border-red-400 @enderror"
        value="{{ old($name, $value) }}" @if ($required) required @endif
        @if ($autofocus) autofocus @endif placeholder="{{$placeholder}}">
    @error($name)
        <span class="block text-red-400 mt-4 small" role="alert">
            <strong>{{ $message }}</strong>
        </span>
    @enderror
</div>
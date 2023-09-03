<div class="flex flex-col">
    @if ($infoRequired)
        <div class="flex justify-end">
            <p class="small mb-2 text-gray-500 text-[12px]">{{ $required ? '(Requerido)' : '(Opcional)' }}</p>
        </div>
    @endif
    <div class="relative btn-font {{ $errors->has($name) ? 'mb-2' : 'mb-6' }}" data-te-input-wrapper-init>
        <textarea
        value="{{ old($name, $value) }}"
            class="peer block min-h-[auto] w-full rounded border-0
            text-primary
            bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none
            transition-all duration-200 ease-linear focus:placeholder:opacity-100
            data-[te-input-state-active]:placeholder:opacity-100 
            motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="{{ $name }}" rows="3" placeholder=""
            @if ($required) required @endif
            @if ($autofocus) autofocus @endif></textarea>
        <label for="{{ $name }}"
            class="pointer-events-none absolute left-3 
            top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]
            text-primary transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] 
            peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem]
            peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none">
            {{ $label }}
        </label>
    </div>
</div>

<div class="flex-col">
    <div class="relative btn-font {{ $errors->has($name) ? 'mb-2' : 'mb-6' }}" data-te-input-wrapper-init>
        <input type="{{ $type }}" id="{{ $name }}"
            class="
           @error($name) border-red-400 @enderror
           peer w-full rounded border outline-none
           h-[44px] inline-flex items-center
           text-primary bg-transparent px-3 py-[4px] transition-all
           duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100
           motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            name="{{ $name }}" value="{{ old($name, $value) }}" @if ($required) required @endif
            @if ($autofocus) autofocus @endif>
        <label for={{ $name }}
            class="pointer-events-none absolute left-3 top-[2px] mb-0 max-w-[90%] origin-[0_0]
            truncate pt-[0.37rem] leading-[1.6] text-primary
            transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] 
            peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem]
            peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none">{{ $label }}</label>
    </div>
    
    @error($name)
        <span class="block text-red-400 mb-4 small" role="alert">
            <strong>{{ $message }}</strong>
        </span>
    @enderror
</div>
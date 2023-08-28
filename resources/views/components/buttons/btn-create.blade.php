@props(['url', 'label'])
<a href="{{ $url }}"
    class="btn btn-secondary px-4">
    <span>{{ $label }}</span>
    <div class="flex ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    </div>
</a>

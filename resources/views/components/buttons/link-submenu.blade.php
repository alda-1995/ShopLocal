@props(['url' => '', 'label' => ''])
<a class="link-submenu group/link" href="{{ route($url) }}">
    <div class="flex mr-1">
        {{ $icon }}
    </div>
    {{ $label }}
    {{ $slot }}
</a>

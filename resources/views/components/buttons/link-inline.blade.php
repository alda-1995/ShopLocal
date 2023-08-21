@props(['url' => '', 'label' => ''])
<a href="{{ route($url) }}" class="text-primary btn-font transition-all duration-300">{{ $label }}</a>
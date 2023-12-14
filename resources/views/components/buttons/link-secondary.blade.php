@props(['url' => '', 'label' => ''])
<a href="{{ route($url) }}" class="btn-secondary">{{ $label }}</a>
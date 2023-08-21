@props(['url' => '', 'label' => ''])
<a href="{{ route($url) }}" class="btn btn-secondary">{{ $label }}</a>
@props(['url' => '', 'label' => ''])
<a href="{{ route($url) }}" class="btn btn-primary">{{ $label }}</a>
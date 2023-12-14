@props(['url' => '', 'label' => '', 'btnClass' => 'btn-primary'])

<a href="{{ route($url) }}" class="btn {{ $btnClass }}">{{ $label }}</a>
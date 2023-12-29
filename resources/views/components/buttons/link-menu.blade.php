@props(['url' => '', 'label' => ''])

<a href="{{ route($url) }}" class="link-menu">{{ $label }}</a>
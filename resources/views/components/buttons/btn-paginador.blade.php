@props(['url' => ''])
<a href="{{$url}}" {{ $attributes->merge(['class' => 'inline-flex text-primary']) }}>
    {{ $slot }}
</a>
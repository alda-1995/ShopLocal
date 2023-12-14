@props(['label' => '', 'name' => '', 'id' => '', 'value' => ''])
<div class="flex items-center mb-4">
    <input id="{{$id}}" type="radio" value="{{ $value }}" name="{{ $name }}" 
    class="w-6 h-6 text-neutral bg-white border-accent
    focus:bg-primary">
    <label for="{{$id}}" class="inline-block ml-2 btn-font">{{$label}}</label>
</div>
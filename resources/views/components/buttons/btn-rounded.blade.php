@props(['type' => 'button', 'typeClass' => 'outline-btn'])
<button type="{{ $type }}"
    class="btn-rounded {{$typeClass}}">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path class="fill-current" d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
    </svg>
</button>

@props(['type' => 'button'])
<button type="{{ $type }}"
    class="h-[60px] w-[60px] border border-base-100 text-base-100 transition-colors duration-300 
  rounded-full flex justify-center items-center hover:bg-primary hover:text-white">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path class="fill-current" d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
    </svg>
</button>

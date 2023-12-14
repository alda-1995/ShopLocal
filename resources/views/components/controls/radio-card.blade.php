@props(['img', 'title' => '', 'name' => '', 'id' => '', 'value' => ''])
<label {{ $attributes->merge(['class' => 'card-img-radio w-full cursor-pointer']) }}>
    <input type="radio" name="{{ $name }}" value="{{ $value }}" class="hidden h-0 w-0">
    <div class="container-radio flex flex-col items-center border-[3px] rounded-lg border-gray-300 p-2 md:p-4">
        <div class="mb-4 h-[100px] md:h-[150px]">
            <img src="{{ $img }}" alt="img" class="max-h-full object-contain">
        </div>
        <h4 class="text-primary btn-font">{{ $title }}</h4>
    </div>
</label>
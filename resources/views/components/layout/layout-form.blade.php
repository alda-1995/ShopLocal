@props(['urlImg' => ''])
<div class="min-h-screen w-full py-24 md:py-20 bg-white">
    <div class="container">
        <div class="flex flex-wrap items-center justify-center lg:justify-between">
            <div class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                <img src="{{$urlImg}}" class="w-full" alt="img sesión" />
            </div>
            <!-- Right column container -->
            <div
                class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12 bg-white rounded shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-4 md:p-8 lg:py-12">
                {{ $slot }}
            </div>
        </div>
    </div>
</div>

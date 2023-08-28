@props(['title' => ''])
<div class="py-24 md:py-28 lg:py-32 min-h-screen">
    <div class="container">
        <div
            class="block md:max-w-[500px] xl:max-w-[600px]
rounded-lg bg-white p-6 md:p-8 lg:p-12
 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            <h4 class="text-primary mb-8">{{$title}}</h4>
            {{ $slot }}
        </div>
    </div>
</div>

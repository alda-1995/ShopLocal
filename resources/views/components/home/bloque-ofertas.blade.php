<div class="pb-16 md:pb-20 lg:pb-36 w-full">
    <div class="container">
        <div class="flex flex-col sm:items-center md:flex-row mb-8 lg:mb-20">
            <div class="md:w-[60%] lg:w-[40%]">
                <h2 class="text-primary mb-4 md:mb-10">Las mejores ofertas las encuentras aquí.</h2>
                <h3 class="text-neutral">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos voluptatem 
                    quo tempora fuga corporis eligendi cumque autem perferendis velit mollitia,
                    numquam nobis nulla dolor, commodi ullam doloribus quas aperiam voluptas adipisci eaque odio.
                    Vitae expedita ipsa perspiciatis blanditiis</h3>
            </div>
            <div class="sm:max-w-md md:w-[40%] lg:w-auto lg:max-w-md lg:ml-8">
                <img src="{{ asset('img/oferta.jpg') }}" class="max-w-full" alt="oferta img">
            </div>
        </div>
        <div class="flex flex-col gap-8 md:gap-10">
            <div class="flex flex-col">
                <h3 class="text-neutral mb-4 md:mb-6">Ofertas</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    <x-cards.card-servicio title="Tienda la margarita" oferta="10" url="/" img="img/food1.jpg" />
                    <x-cards.card-servicio title="Tienda la margarita" oferta="10" url="/" img="img/food2.jpg" />
                    <x-cards.card-servicio title="Tienda la margarita" oferta="10" url="/" img="img/food3.jpg" />
                    <x-cards.card-servicio title="Tienda la margarita" oferta="10" url="/" img="img/food1.jpg" />
                </div>
                <div class="flex justify-center mt-8">
                    <x-buttons.btn-secondary label="Conocer más" />
                </div>
            </div>
        </div>
    </div>
</div>
<div class="py-16 md:py-20 lg:py-24 w-full">
    <div class="container">
        <div class="flex flex-col md:flex-row md:justify-between items-start mb-8 md:mb-16">
            <div class="flex flex-col">
                <h2 class="text-neutral mb-4">Ofertas</h2>
                <p class="small text-base-200">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, mollitia.</p>
            </div>
            <x-buttons.link-primary url="register" btnClass="btn-primary-gray" label="Ver todo" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            <x-cards.card-servicio oferta="10" title="Cobija" text=" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, soluta?" url="/" img="img/food1.jpg" />
            <x-cards.card-servicio title="Cobija" text=" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, soluta?" url="/" img="img/food1.jpg" />
            <x-cards.card-servicio title="Cobija" text=" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, soluta?" url="/" img="img/food1.jpg" />
            <x-cards.card-servicio title="Cobija" text=" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, soluta?" url="/" img="img/food1.jpg" />
        </div>
    </div>
</div>
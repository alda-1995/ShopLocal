<div class="pb-12 md:pb-16 text-neutral">
    <h3 class="mb-4">Bienvenido de nuevo, <span class="text-primary">{{ Auth::user()->name }}</span></h3>
    <h4>Empieza por publicar tu primer empleo, servicio o producto. Que deseas dar a conocer.</h4>
    <div class="mt-12 md:mt-16">
        <h3 class="text-primary mb-6">Publicar</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <x-cards.card-publicar title="Servicios" text="Da a conocer tus servicios de limpieza, salud, etc." url="/" img="img/food1.jpg" />
            <x-cards.card-publicar title="Empleos" text="Tienes un empleo que te gustaria dar a conocer." url="/" img="img/food1.jpg" />
            <x-cards.card-publicar title="Productos" text="Promociona tus productos aquí como comida, artículos, ropa, electrónicos, etc." url="/" img="img/food1.jpg" />
        </div>
    </div>
</div>
<script>
    import { goto } from '$app/navigation'
</script>

<div class='flex flex-col-reverse md:grid md:place-items-center md:grid-cols-2 mx-auto w-full lg:w-3/4 p-4'>
    <div class='ml-4'>
        <h1 class='lg:w-full md:text-5xl text-4xl font-semibold mb-1'>Home Equipments That Makes Life Easy!</h1>
        <p class='mb-2'>Easily buy anytime, anywhere and get products with ease.</p>
        <div class='flex p-1 border inline w-36 text-sm font-medium hover:bg-gray-600 rounded-tr-lg drop-shadow-sm bg-slate-800 border-transparent dark:text-black dark:bg-white text-white'>
            <button on:click={() => goto('#products_display')} class='p-1 mx-1'>Start shopping</button>
            <img src='/forward-49.svg' class='w-4' alt='main display forward icon'/>
        </div>  
    </div>
    <div class='w-full'>
        <img src='/image.png' class='lg' alt='main display side' />
    </div>
</div>
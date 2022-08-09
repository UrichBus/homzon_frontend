<script>
    import { page } from '$app/stores'
    import { browser } from '$app/env'
    import { onMount } from 'svelte/internal'
    import SvelteMarkdown from 'svelte-markdown'
    import { products, total, subtotal, isGhana } from '../stores'

    export const prerender = true, ghanaMult = 8.2

    let id = $page.params.id, product, readmore = false

    onMount(async() => {
        fetch(`${import.meta.env.VITE_HOST_URL}/api/products/${id}?populate=image&fields=name,price,miniDescription,description`)
        .then(res => res.json())
        .then(data => product = data.data)
        .catch(err => console.log(err))  
    })


    function addProduct(id) {
        const productExist = $products.find(element => element.id === id)
        let thePrice 

        if(productExist) alert('Product already added to cart')
        else {
            thePrice = $isGhana.country == 'GH' ? product.attributes.price * ghanaMult : product.attributes.price
            $products.push({
                id: product.id,
                name: product.attributes.name,
                price: thePrice,
                image: `${product.attributes.image.data[0].attributes.url}`
            })
            browser && window.localStorage.setItem('products', JSON.stringify($products))
            $products = $products
            $subtotal = $subtotal + thePrice
            $total = $total + thePrice
        }
    }

    const handleRead = () => readmore ? readmore = false : readmore = true
</script>

{#if !product}
<div class='animate-pulse grid gap-4 w-screen p-2 md:flex md:p-4'>
    <div class='md:flex-1 mx-auto'>
        <img src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921' alt='animation' class='min-w-sm md:max-w-md lg:max-w-lg'>
    </div>
    <div class='md:w-1/2 md:flex-1 p-6'>
        <div class='md:w-1/2 my-2 h-2 bg-slate-200 rounded' />
        <div class='md: w-1/2 mb-4 h-2 bg-slate-200 rounded' />
        <div class='md:w-1/2 space-y-3'>
            <div class='grid grid-cols-3 gap-4'>
              <div class='h-2 bg-slate-200 rounded col-span-2'></div>
              <div class='h-2 bg-slate-200 rounded col-span-1'></div>
            </div>
            <div class='h-2 bg-slate-200 rounded'></div>
        </div>
    </div>
</div>
{/if}

{#if product}
    <div class='grid gap-4 w-screen p-2 md:flex md:p-4'>
        <div class='md:flex-1 mx-auto lg:justify-items-center items-center'>
            <img src={`${product.attributes.image.data[0].attributes.url}`} alt={product.name} class='min-w-sm md:max-w-md lg:max-w-lg lg:ml-4'>
        </div>
        <div class='md:flex-1 p-4'>
            <h1 class='my-2 text-base'><strong>Product name:</strong> {product.attributes.name}</h1>
            <p class='mb-2'><strong>Price: {$isGhana.country == 'GH' ? 'GHC' : 'usd'} {$isGhana.country == 'GH' ? (product.attributes.price * ghanaMult).toFixed(2) : product.attributes.price}</strong></p>
            <h2 class='font-semibold'>Description</h2>
            <h3 class='mb-4'>{product.attributes.miniDescription}</h3>
            {#if readmore}
                <SvelteMarkdown source = {product.attributes.description} />
                <button class='p-2 border border-slate-200 rounded-sm' on:click={handleRead}>Readless</button>
            {:else}
                <button class='p-2 border border-slate-200 rounded-sm' on:click={handleRead}>Readmore</button>
            {/if}
            <div>
                <button on:click={() => addProduct(product.id)} class='bg-slate-800 mt-4 border border-transparent rounded-sm shadow-sm py-2 px-8 text-sm font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400'>
                    Add To Cart
                </button>
            </div>
        </div>
    </div>
{/if}
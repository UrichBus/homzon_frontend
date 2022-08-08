<script>
    import { page } from '$app/stores'
    import { browser } from '$app/env'
    import SvelteMarkdown from 'svelte-markdown'
    import { products, total, subtotal } from '../stores'

    let id = $page.params.id, product, readmore = false

    async function fetchProduct() {
        await fetch(`${import.meta.env.VITE_HOST_URL}/api/products/${id}?fields=name,miniDescription,description,price&populate=image`)
        .then(res => res.json())
        .then(data => product = data.data)
        .catch(err => console.log(err))
    }
    fetchProduct()

    function addProduct(id) {
        const productExist = $products.find(element => element.id === id)

        if(productExist) alert('Product already added to cart')
        else {
            $products.push({
                id: product.id,
                name: product.attributes.name,
                price: product.attributes.price,
                image: `${product.attributes.image.data[0].attributes.url}`
            })
            browser && window.localStorage.setItem('products', JSON.stringify($products))
            $products = $products
            $subtotal = $subtotal + product.attributes.price
            $total = $total + product.attributes.price
        }
    }

    const handleRead = () => readmore ? readmore = false : readmore = true
</script>

{#if product}
    <div class='grid gap-4 w-screen p-2 md:flex md:p-4'>
        <div class='md:flex-1 mx-auto'>
            <img src={`${product.attributes.image.data[0].attributes.url}`} alt={product.name} class='min-w-sm md:max-w-md lg:max-w-lg'>
        </div>
        <div class='md:flex-1 p-6'>
            <h1 class='my-2 text-base'><strong>Product name:</strong> {product.attributes.name}</h1>
            <p class='mb-2'><strong>Price: {product.attributes.price}</strong></p>
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
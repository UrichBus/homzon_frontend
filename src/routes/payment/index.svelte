<script>
    import { page } from '$app/stores'
    import { browser } from '$app/env'
    import { goto } from '$app/navigation'
    import { products, total, subtotal } from '../stores'

    let status = $page.url.searchParams.get('status')
    if(status === 'successful' || status === 'COMPLETED') status = 'success'

    function handleClick() {
        (browser && window.localStorage.removeItem('products'))
        goto('/cart')
    }
    
    if(status === 'success') {
        (browser && window.localStorage.removeItem('products'))  
        $products = []
        $products = $products
        $total = 0
        $subtotal = 0
    } 

</script>

{#if status === 'failed'}
    <div class='w-screen text-center grid place-items-center p-6'>
        <h2 class='text-2xl font-semibold text-red-600 mb-4'>Payment Failed</h2>
        <img class='sm' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Hh1VqD6JL9stDAHDQkAQTfzaGQkgmMHtPw&usqp=CAU' alt='sample success email' />
        <p class='my-2'>Please check your internet connection.</p>
        <small class='my-2 italic'>Slow internet connection can cause payment default to error.</small>
        <p class='my-2'>Please visit the cart page and try again.</p>
        <p class='text-lg font-semibold mt-4'>An error occured during payment.</p>
        <button on:click={handleClick} class='bg-red-600 mt-4 border border-transparent rounded-sm shadow-sm py-2 px-8 text-sm font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400'>
            Try Again
        </button>
    </div>
{/if}

{#if status === 'success'}
    <div class='w-screen text-center grid place-items-center p-6'>
        <h2 class='text-2xl font-semibold text-green-600 mb-2'>Payment Success</h2>
        <img class='sm' src='https://iconarchive.com/download/i60656/double-j-design/origami-colored-pencil/green-mail.ico' alt='sample success email' />
        <p class='my-2'>An invoice will be sent to your mail in less than five minutes.</p>
        <p class='my-2'>This invoice confirms purchase of the various products you added to the cart and just purchased.</p>
        <p class='text-lg font-semibold mt-4'>Thank you for shopping with us!</p>
        <button on:click={() => goto('/')} class='bg-green-600 mt-4 border border-transparent rounded-sm shadow-sm py-2 px-8 text-sm font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400'>
            Continue Shopping
        </button>
    </div>
{/if}
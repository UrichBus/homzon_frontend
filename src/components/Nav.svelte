<script>
    import { products } from '../routes/stores'
</script>

<nav class='bg-white border-gray-200 dark:bg-gray-800'>
    <div class='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5'>
        <a href='/' class='flex items-center'>
            <span class='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>Homzon</span>
        </a>
        <div class='flex items-center'>
            <a href='/account' class='mr-6 text-sm font-medium text-gray-500 dark:text-white hover:underline'>Account</a>
            <a href='/cart' class='text-sm font-medium text-gray-500 dark:text-white hover:underline'>
                Cart
                {#if $products.length !== 0}
                    <sup>{$products.length}</sup>
                {/if}
            </a>
        </div>
    </div>
</nav>
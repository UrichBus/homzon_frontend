<script context='module'>
  import MainDisplay from '../components/MainDisplay.svelte'
  import Geolocation from 'svelte-geolocation'

  export const prerender = true

  let products, location, fetchIt = 0, coords = []

  export async function load({ fetch }) {
    if(fetchIt === 0) {
      await fetch(`${import.meta.env.VITE_HOST_URL}/api/products?populate=image&fields=name,price,miniDescription`)
      .then(res => res.json())
      .then(data => products = data.data)
      .catch(err => console.log(err))
  
      if(coords.length == 0) {
        await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IP_TOKEN}`)
        .then(res => res.json())
        .then(data => location = data)
        .catch(err => console.log(err))
      }
    }
    fetchIt++
  }
</script>

<script>
  import { isGhana } from './stores'
  $isGhana = location
</script>

<Geolocation getPosition bind:coords />
<MainDisplay />
<h1 id='products_display' class='my-5 text-center text-lg font-bold'>Products</h1>
<div class='flex flex-wrap justify-center'>
  {#each products as product ,i}
    <div class='w-full p-4 max-w-sm'>
        <a href={'product/'+product.id} class='c-card block bg-white shadow-md hover:shadow-xl rounded-sm overflow-hidden'>
        <div class='relative pb-2 overflow-hidden'>
          <img class='relative inset-0 h-60 w-full object-contain' src={`${product.attributes.image.data[0].attributes.url}`} alt={product.name}>
        </div>
        <div class='p-4'>
          <h2 class='mt-2 mb-2  font-bold'>{product.attributes.name}</h2>
          <p class='text-sm'>{product.attributes.miniDescription.substring(0, 40)}...</p>
          <div class='mt-3 flex items-center'>
            <span class='text-sm font-semibold'>{location.country === 'GH' ? 'gh' : 'usd'}</span>&nbsp;<span class='font-bold text-xl'>{location.country == 'GH' ? (product.attributes.price * 8.2).toFixed(2) : product.attributes.price}</span>&nbsp;<span class='text-sm font-semibold'>{location.country === 'GH' ? 'C' : '€'}</span>
          </div>
        </div>
        </a>
    </div>
  {/each}
</div>
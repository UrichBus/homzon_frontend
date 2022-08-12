<script context='module'>
  import { goto } from '$app/navigation'
  import MainDisplay from '../components/MainDisplay.svelte'
  import Geolocation from 'svelte-geolocation'

  let products, location, fetchIt = 0, coords = [], ghanaMult = 8.2, trial

  export async function load({ fetch }) {
    if(fetchIt === 0) {
      await fetch(`${import.meta.env.VITE_HOST_URL}/api/products?populate=image&fields=name,price,miniDescription`)
      .then(res => res.json())
      .then(data => products = data.data)
      .catch(err => console.log(err))

      await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IP_TOKEN}`)
      .then(res => res.json())
      .then(data => location = {
        city: data.city,
        country: data.country == 'GH' ? 'Ghana' : '',
        region: data.region,
        countryCode: data.country
      })
      .catch(err => {
        setTimeout(() => {
          reCheckLocation()
        }, 1000)
      })
    }

    async function reCheckLocation() {
      if(coords.length > 0 && fetchIt <= 1) {
        if(!location) {
          await fetch(`http://api.geonames.org/findNearbyJSON?lat=${coords[1]}&lng=${coords[0]}&username=alsinajun`)
          .then(res => res.json())
          .then(data => trial = data)
          .catch(err => console.log(err))
        }
        if(trial) location = {
          countryCode: trial.geonames[0].countryCode, 
          country: trial.geonames[0].countryName,
          region: trial.geonames[0].adminName1
        } 
        if(location) goto('/product/home')
      }
    }
    if(coords && !location && fetch <= 1) reCheckLocation()
    fetchIt++
  }

</script>

<script>
  import { isGhana } from './stores'

  location && ($isGhana = location)
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
            <span class='text-sm font-semibold'>{location && location.countryCode == 'GH' ? 'gh' : 'usd'}</span>&nbsp;
            <span class='font-bold text-xl'>{location && location.countryCode == 'GH' ? (product.attributes.price * ghanaMult).toFixed(2) : product.attributes.price}</span>&nbsp;
            <span class='text-sm font-semibold'>{location && location.countryCode == 'GH' ? 'C' : '€'}</span>
          </div>
        </div>
        </a>
    </div>
  {/each}
</div>
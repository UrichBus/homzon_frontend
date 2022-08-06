<script context='module'>
  let products

  //fetch data from strapi backend
  export async function load({fetch}) {
    await fetch(`${import.meta.env.VITE_HOST_URL}/api/products?populate=image&fields=name,price,miniDescription`)
    .then(res => res.json())
    .then(data => products = data.data)
    .catch(err => console.log(err))
  }
</script>

<h1 class='my-5 text-center text-lg font-bold'>Products</h1>
<div class='flex flex-wrap justify-center'>
    {#each products as product (product.id)}
    <div class='w-full p-4 max-w-sm'>
        <a href={'product/'+product.id} class='c-card block bg-white shadow-md hover:shadow-xl rounded-sm overflow-hidden'>
        <div class='relative pb-2 overflow-hidden'>
          <img class='relative inset-0 h-60 w-full object-contain' src={`http://localhost:1337${product.attributes.image.data[0].attributes.url}`} alt={product.name}>
        </div>
        <div class='p-4'>
          <h2 class='mt-2 mb-2  font-bold'>{product.attributes.name}</h2>
          <p class='text-sm'>{product.attributes.miniDescription.substring(0, 40)}...</p>
          <div class='mt-3 flex items-center'>
            <span class='text-sm font-semibold'>usd</span>&nbsp;<span class='font-bold text-xl'>{product.attributes.price}</span>&nbsp;<span class='text-sm font-semibold'>€</span>
          </div>
        </div>
        </a>
    </div>
    {/each}
</div>
<script>
    import { browser } from '$app/env'
    import { products, subtotal, total } from '../routes/stores'

    export let product

    let quantity = 1

    const increase = () => {
        $subtotal = $subtotal + product.price
        $total = $total + product.price
        quantity++
    }

    const reduceFnc = () => {
        $subtotal = $subtotal - product.price
        $total = $total - product.price
        quantity--
    }

    const decrease = () => quantity > 0 ? reduceFnc() : removeProduct(product.id)

    function removeProduct(id) {
        const toRemove = $products.find(element => element.id === id)
        if(quantity > 0) {
            $subtotal = $subtotal - (toRemove.price * quantity)
            $total = $total - (toRemove.price * quantity)
        }
        const newProducts = $products.filter(element => element.id !== id)
        newProducts && browser && window.localStorage.setItem('products', JSON.stringify(newProducts))
        $products = newProducts
  }
</script>

<li class='flex items-start py-6 space-x-4'>
    <img src={product.image} alt={product.name} class='flex-none w-20 h-20 rounded-md object-center object-cover'>
    <div class='flex-auto space-y-1'>
      <h3 class='text-white mt-4'>{product.name}</h3>
      <div class='flex'>
          <button on:click={decrease} type='button' class='bg-white px-2.5 text-black mr-2 border border-gray-50 rounded-sm p-0.5'>-</button>
          <p class='font-bold'>{quantity}</p>
          <button on:click={increase} type='button' class='bg-white px-2 text-black ml-2 border border-gray-50 rounded-sm p-0.5'>+</button>
      </div>
    </div>
    <div class='grid grid-rows-2 place-items-center'>
      <p class='flex-none text-base font-medium text-white'>${product.price}</p>
      <button on:click={() => removeProduct(product.id)} type='button' class='text-white border border-gray-50 rounded:md p-1.5'>Remove</button>
  </div>
  </li>
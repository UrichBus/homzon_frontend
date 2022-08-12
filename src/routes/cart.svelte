<script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { onMount } from 'svelte/internal'
  import { goto } from '$app/navigation'
  import { browser } from '$app/env'
  import { products, total, subtotal } from './stores'
  import app from './fb'
  import Product from '../components/Product.svelte'
  import { isGhana } from './stores'

  let userName, userEmail, userId, recheckTotal = 0
  
  $: if($subtotal < 0) $subtotal = 0
  $: if($total < 0) $total = 0 
  $: finalTotal = $total.toFixed(2)

  onMount(() => {
    const auth = getAuth(app)
    const user = auth.currentUser
    if (user !== null) {
      userName = user.displayName
      userEmail = user.email
      userId = user.uid
    }
    if($total.length !== 0) recheckTotal = $products.map(element => recheckTotal = element.price + recheckTotal)
    if(recheckTotal[recheckTotal.length - 1] < $total) $total = recheckTotal[recheckTotal.length - 1]
  })

  function callFlutter(data, userid) {
    const userCountry = data.country.toLowerCase()
    let userCurrency = userCountry == 'ghana' ? 'GHS' : 'USD'
    FlutterwaveCheckout({
      public_key: import.meta.env.VITE_F_PUB_KEY,
      tx_ref: 'homzon pay',
      amount: finalTotal,
      currency: userCurrency,
      payment_options: 'card, mobilemoneyghana, ussd',
      redirect_url: import.meta.env.VITE_F_PUB_REDIRECT,
      meta: {
        consumer_id: userid,
      },
      customer: {
        email: userEmail,
        phone_number: data.tel,
        name: userName,
      },
      customizations: {
        title: 'Homzon Pay',
        description: 'Payment for products in cart',
        logo: 'https://res.cloudinary.com/dxflxzfkz/image/upload/v1659997495/logo_rl9wsl.png',
      },
    }) 
  }

  function onSubmit(e) {
    const formData = new FormData(e.target)

    const data = {}
    for (let field of formData) {
      const [key, value] = field
      data[key] = value
    }
    
    
    
    if(userName && userEmail && userId) {
      if(data.address && data.city && data.country && data.region && data.tel) {
        if(data.tel.length >= 10) {
          if (finalTotal > 0) {
            callFlutter(data, userId)
          } else {
            alert('Cart is empty, please add an item.')
          }
        } else {
          alert('Phone number is less than required.')
        }
      } else {
        alert('Please make sure none of the fields is empty.')
      }
    }else if(browser && window.localStorage.getItem('loggedIn')) {
      const auth = getAuth(app)
      const user = auth.currentUser
      if (user !== null) {
        userName = user.displayName
        userEmail = user.email
        userId = user.uid
      }
      if(data.address && data.city && data.country && data.region && data.tel) {
        if(data.tel.length >= 10) {
          if (finalTotal > 0) {
            callFlutter(data, userId)
          } else {
            alert('Cart is empty, please add an item.')
          }
        } else {
          alert('Phone number is less than required.')
        }
      } else {
        alert('Please make sure none of the fields is empty.')
      }
    }
    else {
      alert('Please login or create an account')
      const auth = getAuth(app)
      onAuthStateChanged(auth, (user) => !user && goto('/account'))
    }
  }
</script>

<div class='bg-white'>
    <!-- Background color split screen for large screens -->
    <div class='hidden lg:block fixed top-0 left-0 w-1/2 bg-white' aria-hidden='true'></div>
    <div class='hidden lg:block fixed top-0 right-0 w-1/2 bg-slate-800' aria-hidden='true'></div>
  
    <div class='relative grid grid-cols-1 gap-x-16 max-w-7xl mx-auto lg:px-8 lg:grid-cols-2'>
      <h1 class='sr-only'>Checkout</h1>
  
      <section aria-labelledby='summary-heading' class='bg-slate-800 text-white pt-6 pb-12 md:px-10'>
        <div class='max-w-2xl mx-auto px-4 lg:max-w-none lg:px-0'>
          <h2 id='summary-heading' class='sr-only'>Order summary</h2>
  
          <dl>
            <dt class='text-sm font-medium'>Estimated Total</dt>
            <dd class='mt-1 text-3xl font-extrabold text-white'>${finalTotal}</dd>
          </dl>
  
          <ul role='listbox' class='text-sm font-medium divide-y divide-white divide-opacity-10'>
            {#each $products as product (product.id)}
              <Product {product} />
            {/each}
          </ul>
  
          <dl class='text-sm font-medium space-y-6 border-t border-white border-opacity-10 pt-6'>
            <div class='flex items-center justify-between font-semibold'>
              <dt>Subtotal</dt>
              <dd>${$subtotal.toFixed(2)}</dd>
            </div>
  
            <div class='flex items-center justify-between'>
              <dt>Shipping</dt>
              <!-- <dd>${shipping}</dd> -->
            </div>
  
            <div class='flex items-center justify-between'>
              <dt>Taxes</dt>
              <!-- <dd>${tax}</dd> -->
            </div>
  
            <div class='flex items-center justify-between border-t border-white border-opacity-10 text-white pt-6'>
              <dt class='text-base font-bold'>Total</dt>
              <dd class='text-base font-semibold'>${finalTotal}</dd>
            </div>
          </dl>
        </div>
      </section>
  
      <section aria-labelledby='payment-and-shipping-heading' class='py-16 lg:max-w-lg lg:w-full lg:mx-auto lg:pt-0 lg:pb-24 lg:row-start-1 lg:col-start-1'>
        <h2 id='payment-and-shipping-heading' class='sr-only'>Payment and shipping details</h2>
  
        <form on:submit|preventDefault={onSubmit}>
          <div class='max-w-2xl mx-auto px-4 lg:max-w-none lg:px-0'>
            <div>  
            <div class='mt-10'>
              <h3 id='shipping-heading' class='text-lg font-bold text-gray-900'>Shipping address</h3>
  
              <div class='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3'>
                <div class='sm:col-span-3'>
                  <label for='address' class='block text-sm font-medium text-gray-700'>Address</label>
                  <div class='mt-1'>
                    <input type='text' id='address' name='address' placeholder='eg: Aaron Hawkins, 5587 Nunc. Avenue, Erie Rhode Island 24975' autocomplete='street-address' class='block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400 sm:text-sm'>
                  </div>
                </div>
  
                <div>
                  <label for='city' class='block text-sm font-medium text-gray-700'>City</label>
                  <div class='mt-1'>
                    <input value={$isGhana ? $isGhana.city || '' : ''} type='text' id='city' name='city' placeholder='eg: Accra' autocomplete='address-level2' class='block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400 sm:text-sm'>
                  </div>
                </div>
  
                <div>
                  <label for='region' class='block text-sm font-medium text-gray-700'>State / Region</label>
                  <div class='mt-1'>
                    <input value={$isGhana ? $isGhana.region : ''} type='text' id='region' name='region' placeholder='eg: Greater Accra' autocomplete='address-level1' class='block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400 sm:text-sm'>
                  </div>
                </div>
  
                <div>
                  <label for='country' class='block text-sm font-medium text-gray-700'>Country</label>
                  <div class='mt-1'>
                    <input value={$isGhana ? $isGhana.country : ''} type='text' id='country' name='country' placeholder='eg: Ghana' autocomplete='postal_code' class='block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400 sm:text-sm'>
                  </div>
                </div>
              </div>
            </div>

            <div class='sm:col-span-3'>
              <label for='tel' class='block text-sm mt-6 font-medium text-gray-700'>Phone Number</label>
              <div class='mt-1'>
                <input type='text' id='tel' name='tel' autocomplete='phone-number' placeholder='eg: 0554444444' class='block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400 sm:text-sm'>
              </div>
            </div>
  
            <div class='mt-10'>  
            <div class='mt-10 flex justify-end pt-6 border-t border-gray-200'>
              <button type='submit' class='bg-slate-800 border border-transparent rounded-sm shadow-sm py-2 px-8 text-sm font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400'>Purchase</button>
            </div>
          </div>
        </form>
      </section>
    </div>
</div>
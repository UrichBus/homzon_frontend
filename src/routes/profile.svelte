<script>
    import { goto } from '$app/navigation'
    import { browser } from '$app/env'
    import { beforeUpdate } from 'svelte'
    import { getAuth, signOut } from 'firebase/auth'

    import app from '../stores/fb'
  
    let userName, userEmail

    //retrieves user info before component updates
    beforeUpdate(() => {
        const auth = getAuth(app)
        const user = auth.currentUser
        if (user !== null) {
        userName = user.displayName
        userEmail = user.email
        }
    })

  
    const signOutUser = () => {
      const auth = getAuth(app)
      signOut(auth).then(() => {
      // Sign-out successful
        browser && window.localStorage.removeItem('loggedIn')
        goto('/account')
      }).catch((error) => alert(error))
    }
  </script>
  
  <div class='p-4 pt-20 md:p-12 text-center lg:text-left'>
      <!-- Image for mobile view-->
      <div class='block lg:hidden rounded-sm shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center' style='background-image: url("https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png")'></div>
      
      <div class='lg:flex justify-center'>
          <div class='w-48 lg:w-1/5'>
              <img alt='upload' src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png' class='rounded-none lg:rounded-sm shadow-lg hidden lg:block'>
          </div>
          <div class='lg:pl-8 lg:pt-4'>
            {#if userName && userEmail}
              <h1 class='text-3xl font-bold pt-8 lg:pt-0'>{userName.toUpperCase()}</h1>
              <p class='pt-4 text-base font-bold flex items-center justify-center lg:justify-start'>{userEmail}</p>
            {/if}
              <div class='pt-12 pb-8'>
                  <button on:click={signOutUser} type='button' class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-sm text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Signout</button>
              </div>
          </div>
      </div>
  </div>
  
  <div class='relative mb-10 overflow-x-auto shadow-md sm:rounded-sm'>
      <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead class='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                  <th scope='col' class='px-6 py-3'>
                      Orders
                  </th>
                  <th scope='col' class='px-6 py-3'>
                      Status
                  </th>
                  <th scope='col' class='px-6 py-3'>
                      Date
                  </th>
                  <th scope='col' class='px-6 py-3'>
                      Price
                  </th>
              </tr>
          </thead>
          <tbody>
              <tr class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                  <th scope='row' class='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                      Apple MacBook Pro 17'
                  </th>
                  <td class='px-6 py-4'>
                      Active
                  </td>
                  <td class='px-6 py-4'>
                      Laptop
                  </td>
                  <td class='px-6 py-4'>
                      $2999
                  </td>
              </tr>
              <tr class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                  <th scope='row' class='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                      Microsoft Surface Pro
                  </th>
                  <td class='px-6 py-4'>
                      Active
                  </td>
                  <td class='px-6 py-4'>
                      Laptop PC
                  </td>
                  <td class='px-6 py-4'>
                      $1999
                  </td>
              </tr>
              <tr class='bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600'>
                  <th scope='row' class='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                      Magic Mouse 2
                  </th>
                  <td class='px-6 py-4'>
                      Delivered
                  </td>
                  <td class='px-6 py-4'>
                      Accessories
                  </td>
                  <td class='px-6 py-4'>
                      $99
                  </td>
              </tr>
          </tbody>
      </table>
  </div>
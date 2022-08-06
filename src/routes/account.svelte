<script>
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
    import { goto } from '$app/navigation'
    import { browser } from '$app/env'
    import app from './fb'

    let avatar, isRegister = true

    function handleRegister() {
        isRegister ? isRegister = false : isRegister = true
    }

    browser && window.localStorage.getItem('loggedIn') && goto('/profile')

    async function onSubmit(e) {
        const formData = new FormData(e.target)

        const data = {}
        for (let field of formData) {
            const [key, value] = field
            data[key] = value
        }

        if(data.password !== '' && data.email !== '') {
            const auth = getAuth(app)
            const email = data.email, password = data.password, firstname = data.firstname, lastName = data.lastname
            if(data.lastName !== '' && data.firstname !== '' && data.password <= 6) {
                password <= 6 ? alert('Password should be more than 6 characters long!') :
                alert('firstname or lastname should not be empty')
            } else {
                if(isRegister) {
                    if(data.password !== data.confirm_password) {
                        alert('Password does not match!')
                    } else {
                        createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            // Signed in 
                            updateProfile(auth.currentUser, {
                                displayName: `${firstname} ${lastName}`
                            })
                            .then(() => {
                                browser && window.localStorage.setItem('loggedIn', 'true')
                                goto('/profile')
                            })
                            .catch(err => alert(err))
                        })
                        .catch((error) => {
                            const errorCode = error.code
                            const errorMessage = error.message
                        })
                    }
                } else {
                    signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed in 
                        browser && window.localStorage.setItem('loggedIn', 'true')
                        goto('/profile')
                    })
                    .catch((error) => {
                        const errorCode = error.code
                        const errorMessage = error.message
                    })
                }
            }
        } else {
            alert('Please provide value(s) in the leftout field(s)')
        }
    }
</script>

<h1 class='text-center font-bold dark:text-white mt-4'>{isRegister ? 'Create an account': 'Login to account'}</h1>
<div id='app'>
    {#if isRegister === true}
	<!-- <h1>Upload Image</h1> -->
        {#if avatar}
        <img class='avatar' src='{avatar}' alt='d' />
        {:else}
        <img class='avatar' src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png' alt='' /> 
        {/if}
		{:else}
        <img class='avatar' src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png' alt='' />
    {/if}
    <form class='w-full max-w-lg giveSpace' on:submit|preventDefault={onSubmit}>
        {#if isRegister === true}
        <div class='flex flex-wrap -mx-3 mb-6'>
            <div class='w-sm mx-auto sm:w-full md:w-1/2 px-3 mb-6 md:mb-0'>
              <label name='fname' class='block uppercase dark:text-white tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-first-name'>
                First Name
              </label>
              <input class='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-first-name' type='text' placeholder='firstname' value='' name='firstname'>
            </div>
            <div class='w-sm mx-auto sm:w-full md:w-1/2 px-3'>
              <label name='lname' class='block uppercase dark:text-white tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-last-name'>
                Last Name
              </label>
              <input value='' class='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-last-name' type='text' placeholder="lastname" name='lastname'>
            </div>
          </div>
        {/if}
        <div class='flex flex-wrap -mx-3 mb-6'>
            <div class='w-sm mx-auto sm:w-full px-3'>
              <label name='mail' class='block dark:text-white uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-password'>
                Email
              </label>
              <input name='email' class='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-password mail' type='email' value='' placeholder='example@gmail.com' />
            </div>
        </div>
        <div class='flex flex-wrap -mx-3 mb-6'>
          <div class='w-sm mx-auto sm:w-full px-3'>
            <label name='pass' class='block dark:text-white uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-password'>
              Password
            </label>
            <input name='password' class='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-password pass' type='password' value='' placeholder='*************'>
            {#if isRegister === true}
                <p class='text-gray-600 text-xs italic'>Include atleaset a symbol</p>
            {/if}
          </div>
        </div>
        {#if isRegister === true}
            <div class='flex flex-wrap -mx-3 mb-6'>
                <div class='w-sm mx-auto sm:w-full px-3'>
                <label name='cPass123' class='block uppercase dark:text-white tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-password'>
                    Confirm Password
                </label>
                <input name='confirm_password' class='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-password cPass' type='password' value='' placeholder='*************'>
                </div>
            </div>
            <p class='text-center'>Have an account already <button on:click={handleRegister}><strong>Login</strong></button></p>
        {/if}
        {#if isRegister === false}
            <p class='text-center'>Don't have an account <button on:click={handleRegister}><strong>Register</strong></button></p>
        {/if}
        <div class='mt-5 flex justify-center'>
            {#if isRegister}
            <button type='submit' class='bg-slate-800 border border-transparent rounded-sm shadow-sm py-2 px-8 text-sm font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400'>Register</button>
            {:else}
            <button type='submit' class='bg-slate-800 border border-transparent rounded-sm shadow-sm py-2 px-8 text-sm font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400'>Login</button>
            {/if}
        </div>
    </form>
</div>

<style>
    .giveSpace {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #app{
        display:flex;
        align-items:center;
        justify-content:center;
        flex-flow:column;
    }
    .avatar{
        display:flex;
        height:200px;
        width:200px;
    }
</style>
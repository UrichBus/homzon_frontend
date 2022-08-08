import { browser } from '$app/env'
import { writable } from 'svelte/store'

let initial = browser && JSON.parse(window.localStorage.getItem('products'))

if(initial === null || initial == 0) initial = []

let final = 0
if(initial.length !== 0 || initial !== null) initial.map(element => final = element.price + final)

export const products = writable(initial)
export const total = writable(final)
export const subtotal = writable(final)
  
products.subscribe(value => browser && window.localStorage.setItem('products', JSON.stringify(value)))
total.subscribe(value => value)
subtotal.subscribe(value => value)

//Fetch products from backend
let allProducts
await fetch(`${import.meta.env.VITE_HOST_URL}/api/products?populate=image&fields=name,price,miniDescription,description`)
    .then(res => res.json())
    .then(data => allProducts = data.data)
    .catch(err => console.log(err))
export default allProducts
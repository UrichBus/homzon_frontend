import { browser } from '$app/env'
import { writable } from 'svelte/store'

let initial = browser && JSON.parse(window.localStorage.getItem('products'))

if(initial === null || initial == 0) initial = []

let final = 0
if(initial.length !== 0 || initial !== null) initial.map(element => final = element.price + final)

export const products = writable(initial)
export const total = writable(final)
export const subtotal = writable(final)
export const isGhana = writable('')
  
products.subscribe(value => browser && window.localStorage.setItem('products', JSON.stringify(value)))
total.subscribe(value => value)
subtotal.subscribe(value => value)

import { goto } from '$app/navigation'

export const ghanaMult = 9.4, nigeriaMult = 420.5
export function initPayPalButton(total) {
  if(total > 0) {
    paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'paypal',
        
      },
  
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{"amount":{"currency_code":"USD","value": total}}]
        })
      },
  
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(orderData) {
          
          // Full available details
          //console.log('Capture result', orderData, JSON.stringify(orderData, null, 2))
  
          // Show a success message within this page, e.g.
          
          // Or go to another URL:  actions.redirect('thank_you.html')
          let orderStatus
          orderData.status == 'COMPLETED' ? orderStatus = 'success' : orderStatus = 'failed'
          goto(`${import.meta.env.VITE_F_PUB_REDIRECT}?status=${orderStatus}`)
        })
      },
  
      onError: function(err) {
        console.log(err)
      }
    }).render('#paypal-button-container')
    count++
  } else alert('Please add item to cart.')
}

export function callFlutter(data, userid, userName, userEmail, finalTotal, orderId, isGhana) {
  const userCountry = data.country.toLowerCase()
  let userCurrency = userCountry == 'ghana' ? 'GHS' : userCountry == 'nigeria' ? 'NGN' : 'USD'
  let ghanaTotal = finalTotal * ghanaMult, nigeriaTotal = finalTotal * nigeriaMult
  if(userCurrency == 'GHS' && !isGhana) finalTotal = ghanaTotal
  if(userCurrency == 'NGN') finalTotal = nigeriaTotal

  FlutterwaveCheckout({
    public_key: import.meta.env.VITE_F_PUB_KEY,
    tx_ref: orderId,
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
<script context="module">
  export const prerender = true;

  let products,
    location,
    fetchIt = 0;

  //fetch all products from strapi db
  export async function load({ fetch }) {
    if (fetchIt === 0) {
      await fetch(
        `${
          import.meta.env.VITE_HOST_URL
        }/api/products?populate=image&fields=name,price,miniDescription,description`
      )
        .then((res) => res.json())
        .then((data) => (products = data.data))
        .catch((err) => console.log(err));

      await fetch(
        `https://ipinfo.io/json?token=${import.meta.env.VITE_IP_TOKEN}`
      )
        .then((res) => res.json())
        .then(
          (data) =>
            (location = {
              city: data.city,
              country: data.country == "GH" ? "Ghana" : "",
              region: data.region,
              countryCode: data.country,
            })
        )
        .catch((err) => {});
    }
    fetchIt++;
  }

  export { products };
</script>

<script>
  import { browser } from "$app/env";
  import { getAnalytics } from "firebase/analytics";

  import MainDisplay from "../components/MainDisplay.svelte";

  import app from "../stores/fb";
  import { ghanaMult } from "../stores/pay";
  import { isGhana } from "../stores/stores";

  //check if location is defined then set isGhana to it's value
  location && ($isGhana = location);

  //initiate firebase analytics
  browser && getAnalytics(app);
</script>

<MainDisplay />
<h1 id="products_display" class="my-5 text-center text-lg font-bold">
  Products
</h1>
<div class="flex flex-wrap justify-center">
  {#each products as product, i}
    <div class="w-full p-4 max-w-sm">
      <a
        sveltekit:prefetch
        href={"product/" + product.id}
        class="c-card block bg-white shadow-md hover:shadow-xl rounded-sm overflow-hidden"
      >
        <div class="relative pb-2 overflow-hidden">
          <img
            class="relative inset-0 h-60 w-full object-contain"
            src={`${product.attributes.image.data[0].attributes.url}`}
            alt={product.name}
          />
        </div>
        <div class="p-4">
          <h2 class="mt-2 mb-2  font-bold">{product.attributes.name}</h2>
          <p class="text-sm">
            {product.attributes.miniDescription.substring(0, 40)}...
          </p>
          <div class="mt-3 flex items-center">
            <span class="text-sm font-semibold"
              >{location && location.countryCode == "GH" ? "gh" : "usd"}</span
            >&nbsp;
            <span class="font-bold text-xl"
              >{location && location.countryCode == "GH"
                ? (product.attributes.price * ghanaMult).toFixed(2)
                : product.attributes.price}</span
            >&nbsp;
            <span class="text-sm font-semibold"
              >{location && location.countryCode == "GH" ? "C" : "???"}</span
            >
          </div>
        </div>
      </a>
    </div>
  {/each}
</div>

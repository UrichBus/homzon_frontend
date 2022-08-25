<script>
    import Nav from '../components/Nav.svelte'
    import Footer from '../components/Footer.svelte'
    import '../main.css'
</script>

<svelte:head>
    <link rel='preconnect' href='https://fonts.googleapis.com'>
    <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
    <link href='https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;900&display=swap' rel='stylesheet'>
    <title>Homzon</title>
    <script defer src='https://checkout.flutterwave.com/v3.js'></script>
    <script defer src={'https://www.paypal.com/sdk/js?client-id='+import.meta.env.VITE_PCLIENT_ID+'&disable-funding=paylater'} data-sdk-integration-source="button-factory"></script>
</svelte:head>

<Nav />
<main>
    <slot />
</main>
<Footer />

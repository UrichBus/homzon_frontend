<script>
    import Nav from '../components/Nav.svelte'
    import Footer from '../components/Footer.svelte'
    import Alert from '../components/Alert.svelte'
    import '../main.css'
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;900&display=swap" rel="stylesheet">
    <title>Homzon</title>
</svelte:head>

<Nav />
<Alert />
<main>
    <slot />
</main>
<Footer />
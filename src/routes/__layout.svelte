<script lang="ts">
    import Header from '$lib/Header.svelte';
    import '../app.css';
    import Footer from "$lib/Footer.svelte";
</script>

<Header/>

<main>
    <slot/>
</main>

<Footer/>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
    }
</style>

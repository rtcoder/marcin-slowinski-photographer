<script lang="ts">
    import Footer from '$lib/Footer.svelte';
    import Header from '$lib/Header.svelte';
    import '../app.css';
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
        min-height: calc(100vh - 145px);
    }

    @media (max-width: 640px) {
        main {
            min-height: calc(100vh - 185px);
        }
    }
</style>

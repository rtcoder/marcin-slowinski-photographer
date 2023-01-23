<script context="module" lang="ts">
    export const prerender = true;
</script>

<svelte:head>
    <title>Marcin Słowiński - Fotograf</title>
</svelte:head>

<section id="top-section">
    <div class="info">Marcin Słowiński - fotograf</div>
</section>

<section>
    <h1>O mnie</h1>
    <p class="about-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Etiam in ultrices elit. Class aptent taciti sociosqu ad
        litora torquent per conubia nostra, per inceptos himenaeos.
        Cras leo lacus, bibendum sed libero nec, accumsan accumsan
        purus. Ut vel nisi eu nulla luctus pellentesque eu eget mauris.
        Etiam elementum, nisl vel mollis laoreet, velit lacus fringilla
        enim, ac convallis arcu est molestie orci. Integer sed
        massa ipsum. Fusce quis auctor urna. Praesent imperdiet
        lectus massa, ut molestie orci scelerisque eget.
    </p>
</section>
<style>
    #top-section {
        background-image: url('images/bg.jpg');
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-color: #000;
        height: calc(100vh - 80px);
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
        align-items: center;
    }

    .info {
        padding-top: 20px;
        width: 50%;
        font-size: 35px;
        font-weight: 100;
        text-shadow: -1px 1px 0 #000,
        1px 1px 0 #000,
        1px -1px 0 #000,
        -1px -1px 0 #000;
        color: #fff;
    }

    .about-text {
        padding: 0 50px;
        line-height: 1.7;
        letter-spacing: 1px;
    }

    @media (max-width: 769px) {
        .info {
            padding-top: 200px;
        }
    }

    @media (max-width: 550px) {
        .info {
            padding-top: 200px;
            text-align: center;
            width: 100%;
        }
    }


</style>



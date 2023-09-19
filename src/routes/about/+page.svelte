<svelte:head>
    <title>Marcin Słowiński - Fotograf</title>
</svelte:head>

<script context="module" lang="ts">
    export const prerender = true;
    import Heading from '../../lib/Heading.svelte';
</script>

<section id="top-section">
    <div class="info">Marcin Słowiński - fotograf</div>
</section>

<section>
    <Heading>O mnie</Heading>
    <p class="about-text">
        Jestem profesjonalnym fotografem z wieloletnim doświadczeniem w różnych dziedzinach fotografii,
        takich jak zdjęcia ślubne, rodzinne i okolicznościowe. Moje portfolio jest pełne różnorodnych
        projektów, które pokazują moją elastyczność i umiejętność dostosowywania się do różnych potrzeb
        klientów.
        <br/>
        <br/>
        Jestem specjalistą, który zawsze dąży do perfekcji w swojej pracy. Posiadam wysokiej jakości sprzęt
        i oprogramowanie, dzięki czemu jestem w stanie uchwycić każdy detal i przenieść emocje na zdjęciach.
        <br/>
        <br/>
        Jestem również otwarty na współpracę i wszelkie sugestie klientów, aby zapewnić im jak najlepsze
        rezultaty. Moje portfolio jest żywym dowodem na to, że mogę zaoferować najwyższą jakość usług fotograficznych
        i zapewnić zadowolenie każdego klienta.
    </p>
</section>

<style>
    #top-section {
        background-image: url('images/bg.jpg');
        background-size: auto 100%;
        background-repeat: no-repeat;
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
        text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;
        color: #fff;
    }

    .about-text {
        padding: 50px;
        line-height: 1.7;
        letter-spacing: 1px;
    }

    @media (max-width: 769px) {
        .info {
            padding-top: 200px;
        }

        .about-text {
            font-size: 22px;
        }
    }

    @media (max-width: 550px) {
        .info {
            padding-top: 200px;
            text-align: center;
            width: 100%;
        }

        .about-text {
            font-size: 25px;
            padding-left: 30px;
            padding-right: 30px;
        }
    }
</style>

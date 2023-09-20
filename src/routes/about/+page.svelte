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
        Witaj! Jestem pasjonatem fotografii z wieloletnim doświadczeniem, specjalizującym się w różnych dziedzinach,
        takich jak niezapomniane zdjęcia ślubne, ciepłe fotografie rodzinne oraz artystyczne zdjęcia okolicznościowe.
        Moje podejście do fotografii opiera się na tworzeniu niepowtarzalnych momentów i uchwyceniu piękna w każdym
        kadrze.
        <br>
        <br>
        Mój szeroki wachlarz projektów w portfolio to rezultat mojej elastyczności oraz zdolności do dostosowywania się
        do indywidualnych potrzeb klientów. Zawsze stawiam na perfekcję w mojej pracy, co sprawia, że nie przegapiam
        żadnych detali i potrafię przenieść emocje na zdjęciach, które będą trwać przez lata.
        <br>
        <br>
        Posiadam sprzęt i oprogramowanie najwyższej jakości, co gwarantuje wyjątkową jakość każdego zdjęcia. Ponadto,
        jestem otwarty na współpracę i gotowy na wszelkie sugestie klientów, aby zagwarantować im zdjęcia spełniające
        ich oczekiwania.
        <br>
        <br>
        Moje portfolio to nie tylko zbiór prac, to opowieść o moim zobowiązaniu do dostarczania najwyższej jakości usług
        fotograficznych i zadowolenia każdego klienta. Razem stworzymy niezapomniane wspomnienia. Zapraszam do kontaktu!
    </p>
</section>

<style>
    #top-section {
        background-image: url('/images/bg.jpg');
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

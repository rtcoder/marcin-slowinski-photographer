<script>
    import {onMount} from 'svelte';
    import {getDominantColor} from "@rtcoder/dominant-color";

    const photos = [
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
        '/images/profile-small.jpg',
    ];

    onMount(() => {

        const images = document.querySelectorAll('.photo');
        images.forEach(image => {
                const img = image.querySelector('img');
                getDominantColor(img, {
                    downScaleFactor: 1,
                    skipPixels: 50,
                    colorsPaletteLength: 5,
                    paletteWithCountOfOccurrences: false,
                    colorFormat: 'rgb',
                    callback: (color, palette) => {
                        console.log({color, palette});
                        image.style.borderColor = color;
                    }
                });
            }
        );
    });
</script>

<svelte:head>
    <title>Portfolio</title>
</svelte:head>

<div class="categories">
    <ul>
        <li class="active">Wszystkie</li>
        <li>Śluby</li>
        <li>Portrety</li>
        <li>Komunie</li>
        <li>Chrzty</li>
    </ul>
</div>

<section class="photos">
    {#each photos as photo}
        <div class="photo">
            <img src="{photo}" alt="">
        </div>
    {/each}
</section>

<style>
    .categories {
        background-color: #0f0f0f;
        padding: 10px 0;
    }

    ul {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    li {
        cursor: pointer;
        padding: 5px 10px;
        margin: 0 5px;
    }

    .photos {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: 20px 10px;
        padding: 10px 15px;
        width: 100%;
        align-items: center;
    }

    .photo {
        width: -webkit-fill-available;
        aspect-ratio: 1/1;
        justify-self: center;
        padding: 5px;
        cursor: pointer;
        border-radius: 10px;
        border: 2px solid;
    }

    .photo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
        user-select: none;
    }
</style>

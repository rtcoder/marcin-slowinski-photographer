<script>
    import Lightbox from '$lib/Lightbox.svelte';

    const galleries = [
        {
            name: 'Testowa nazwa galerii',
            photos: [
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
            ],
        },
        {
            name: 'Testowa nazwa galerii',
            photos: [
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
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
            ],
        },
        {
            name: 'Testowa nazwa galerii',
            photos: [
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
            ],
        },
        {
            name: 'Testowa nazwa galerii',
            photos: [
                '/images/profile-small.jpg',
                '/images/profile-small.jpg',
            ],
        },
    ];
    let lightboxDisplay = false;

    let selectedGallery = null;
    $:{
        console.log({lightboxDisplay, selectedGallery});
    }

    function onClickGallery(idx) {
        selectedGallery = galleries[idx];
        lightboxDisplay = true;
    }

    function onCloseLightbox() {
        lightboxDisplay = false;
        selectedGallery = null;
    }
</script>

<svelte:head>
    <title>Portfolio</title>
</svelte:head>

<div class="categories">
    <ul>
        <li class="active">Wszystkie</li>
        <li>Plener</li>
        <li>Śluby</li>
        <li>Portrety</li>
        <li>Komunie</li>
        <li>Chrzty</li>
    </ul>
</div>

<section class="photos">
    {#each galleries as gallery, index}
        <div class="photo" on:click={onClickGallery.bind(this, index)}>
            <img src={gallery.photos[0]} alt=""/>
            <p class="name">{gallery.name}</p>
        </div>
    {/each}
</section>

{#if lightboxDisplay}
    <Lightbox
            on:closeLightbox={onCloseLightbox}
            lightboxDisplay={lightboxDisplay}
            images={selectedGallery?.photos ?? []}
            title={selectedGallery?.name ?? ''}/>
{/if}

<style>
    .categories {
        background-color: #0f0f0f;
        padding: 10px 0;
        position: sticky;
        width: 100%;
        top: 60px;
        box-shadow: 0 0 1px 0 var(--accent_color);
        z-index: 1;
    }

    ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }

    li {
        cursor: pointer;
        padding: 5px 10px;
        margin: 0 5px;
    }

    li.active, li:hover {
        color: var(--accent_color);
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
        border: 2px solid #525252;
        position: relative;
        overflow: hidden;
    }

    .photo:hover {
        border-color: var(--accent_color);
    }

    .photo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.2s ease-in;
    }

    .photo:hover img {
        transform: scale(1.1);
    }

    .photo p.name {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        text-align: center;
        font-size: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.2s ease-in;
    }

    .photo:hover p.name {
        opacity: 1;
    }
</style>

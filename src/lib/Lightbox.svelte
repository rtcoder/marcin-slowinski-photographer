<script>
    import Icon from '$lib/Icon.svelte';
    import {createEventDispatcher, onMount} from "svelte";

    export let images = [];
    export let lightboxDisplay = false;

    const dispatch = createEventDispatcher();

    let containerWidth = 0;
    let wrapperWidth = 0;
    let thumbnailsWrapperWidth = 0;
    let transformWrapperXAxis = 0
    let transitionDurationWrapper = 0.3;
    let photoIndex = 0;
    let touchStartPositionX = 0;
    let touchMovePositionX = 0
    let touchPositionXDiff = 0

    function closeLightbox() {
        dispatch('closeLightbox', {});
        lightboxDisplay = false;
        images = [];
        photoIndex = 0;
    }

    function onResize() {
        containerWidth = document.querySelector('.images-container').getBoundingClientRect().width;
        wrapperWidth = containerWidth * images.length;
        thumbnailsWrapperWidth = 90 * images.length;
        transformWrapperXAxis = -(photoIndex * containerWidth);
    }

    function nextPhoto() {
        photoIndex++;
        if (photoIndex >= images.length - 1) {
            photoIndex = images.length - 1;
        }
        onResize();
    }

    function prevPhoto() {
        photoIndex--;
        if (photoIndex < 0) {
            photoIndex = 0;
        }
        onResize();
    }

    function goToPhoto(index) {
        photoIndex = index;
        if (photoIndex < 0) {
            photoIndex = 0;
        }
        if (photoIndex >= images.length - 1) {
            photoIndex = images.length - 1;
        }
        onResize();

    }

    onMount(() => {
        onResize();

        const images$ = document.querySelector('.images');

        window.addEventListener("resize", onResize);
        document.body.addEventListener("keydown", e => {
            if (!lightboxDisplay) {
                return;
            }
            if (e.key === 'ArrowLeft') {
                prevPhoto();
            }
            if (e.key === 'ArrowRight') {
                nextPhoto();
            }
        });
        images$.addEventListener('click', e => {
            if (e.target.classList.contains('left-arrow')) {
                prevPhoto();
            }

            if (e.target.classList.contains('right-arrow')) {
                nextPhoto();
            }
        });
        document.querySelector('.fa-close').addEventListener('click', closeLightbox);
        images$.addEventListener('touchstart', e => {
            touchStartPositionX = e.touches[0].pageX;
        });
        images$.addEventListener('touchmove', e => {
            touchMovePositionX = e.touches[0].pageX;

            touchPositionXDiff = touchMovePositionX - touchStartPositionX;

            if (transformWrapperXAxis + touchPositionXDiff > 50) {
                touchPositionXDiff = 50;
            }
            if (transformWrapperXAxis + touchPositionXDiff < -wrapperWidth + containerWidth - 50) {
                touchPositionXDiff = -50;
            }

            transitionDurationWrapper = 0
        });
        images$.addEventListener('touchend', e => {
            transformWrapperXAxis = transformWrapperXAxis + touchPositionXDiff;
            const newIndex = Math.abs(Math.round(transformWrapperXAxis / containerWidth));

            touchMovePositionX = 0;
            touchStartPositionX = 0;
            touchPositionXDiff = 0;

            transitionDurationWrapper = 0.3;

            goToPhoto(newIndex);
        });
    });
</script>

<div class="lightbox"
     style="
     --container_width: {containerWidth}px;
     --wrapper_width: {wrapperWidth}px;
     --thumbnails_wrapper_width: {thumbnailsWrapperWidth}px;
     --transform_wrapper_x_axis: {transformWrapperXAxis + touchPositionXDiff}px;
">
    <div class="top">
        <Icon name="fa-solid fa-close" size="48"/>
    </div>
    <div class="images">
        <div class="arrow">
            <Icon name="fa-solid fa-chevron-left left-arrow" size="48"/>
        </div>
        <div class="images-container">
            <div class="wrapper" style="--transition_duration:{transitionDurationWrapper}s">
                {#each images as image}
                    <div class="image">
                        <img src={image} alt=""/>
                    </div>
                {/each}
            </div>
        </div>
        <div class="arrow">
            <Icon name="fa-solid fa-chevron-right right-arrow" size="48"/>
        </div>
    </div>
    <div class="bottom">
        <div class="thumbnails-container">
            <div class="thumbnails">
                {#each images as image, index}
                    {#if (index === photoIndex)}
                        <div class="thumbnail active">
                            <img src={image} alt=""/>
                        </div>
                    {:else}
                        <div class="thumbnail" on:click={goToPhoto.bind(this, index)}>
                            <img src={image} alt=""/>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        background: var(--bg_color);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 15px;
    }

    .lightbox :global(i) {
        cursor: pointer;
    }

    .lightbox :global(i):hover {
        color: var(--accent_color);
    }

    .top, .images, .bottom {
        width: 100%;
    }

    .top {
        display: flex;
        justify-content: flex-end;
        height: 50px;
    }

    .bottom {
        display: flex;
        height: 100px;
    }

    .thumbnails-container {
        overflow: hidden;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .thumbnails {
        width: var(--thumbnails_wrapper_width);
        display: flex;
        align-items: center;
        height: 100px;
    }

    .thumbnail {
        width: 90px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid transparent;
        padding: 3px;
        cursor: pointer;
    }

    .thumbnail.active {
        border-color: var(--accent_color);
        cursor: default;
    }

    .thumbnail img {
        max-width: 100%;
        max-height: 100%;
    }

    .images {
        height: calc(100% - 150px);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .images > * {
        height: 100%;
    }

    .images .arrow {
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .images .images-container {
        width: calc(100% - 100px);
        overflow: hidden;
    }

    .images .images-container .wrapper {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: var(--wrapper_width);
        transform: translateX(var(--transform_wrapper_x_axis));
        transition: transform var(--transition_duration) ease-in;
    }

    .images-container .image {
        height: 100%;
        width: var(--container_width);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image img {
        max-width: 100%;
        max-height: 100%;
    }
</style>

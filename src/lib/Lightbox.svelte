<script>
    import Icon from '$lib/Icon.svelte';
    import {createEventDispatcher, onMount} from 'svelte';

    export let images = [];
    export let title = '';
    export let lightboxDisplay = false;

    const dispatch = createEventDispatcher();

    let photoIndex = 0;
    let containerWidth = 0;
    let wrapperWidth = 0;
    let transformWrapperXAxis = 0;
    let transitionDurationWrapper = 0.3;
    let touchStartPositionX = 0;
    let touchMovePositionX = 0;
    let touchPositionXDiff = 0;
    let thumbnailsWidth;
    let thumbnailsContainerWidth;

    function closeLightbox() {
        dispatch('closeLightbox', {});
        lightboxDisplay = false;
        images = [];
        photoIndex = 0;
        console.log(lightboxDisplay)
    }

    function onResize() {
        containerWidth = document.querySelector('.images-container').getBoundingClientRect().width;
        wrapperWidth = containerWidth * images.length;
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

    function onKeyDown(e) {
        if (!lightboxDisplay) {
            return;
        }
        if (e.key === 'ArrowLeft') {
            prevPhoto();
        }
        if (e.key === 'ArrowRight') {
            nextPhoto();
        }
    }

    function galleryTouchStart(e) {
        touchStartPositionX = e.touches[0].pageX;
    }

    function galleryTouchEnd() {
        transformWrapperXAxis = transformWrapperXAxis + touchPositionXDiff;
        const newIndex = Math.abs(Math.round(transformWrapperXAxis / containerWidth));

        touchMovePositionX = 0;
        touchStartPositionX = 0;
        touchPositionXDiff = 0;

        transitionDurationWrapper = 0.3;

        goToPhoto(newIndex);
    }

    function galleryTouchMove(e) {
        touchMovePositionX = e.touches[0].pageX;

        touchPositionXDiff = touchMovePositionX - touchStartPositionX;

        if (transformWrapperXAxis + touchPositionXDiff > 50) {
            touchPositionXDiff = 50;
        }
        if (transformWrapperXAxis + touchPositionXDiff < -wrapperWidth + containerWidth - 50) {
            touchPositionXDiff = -50;
        }

        transitionDurationWrapper = 0;
    }

    onMount(() => {
        onResize();
    });
</script>

<svelte:body on:keydown|preventDefault={onKeyDown}/>
<svelte:window on:resize|preventDefault={onResize}/>

<div class="lightbox"
     style="
     --container_width: {containerWidth}px;
     --wrapper_width: {wrapperWidth}px;
     --transform_wrapper_x_axis: {transformWrapperXAxis + touchPositionXDiff}px;
">
    <div class="top">
        <h2>{title}</h2>
        <Icon name="fa-solid fa-close" size="48" on:click={closeLightbox}/>
    </div>
    <div class="images" on:touchstart={galleryTouchStart} on:touchmove={galleryTouchMove} on:touchend={galleryTouchEnd}>
        <div class="arrow" on:click={prevPhoto}>
            {#if photoIndex > 0}
                <Icon name="fa-solid fa-chevron-left left-arrow" size="48"/>
            {/if}
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
        <div class="arrow" on:click={nextPhoto}>
            {#if photoIndex < images.length - 1}
                <Icon name="fa-solid fa-chevron-right right-arrow" size="48"/>
            {/if}
        </div>
    </div>
    <div class="bottom">
        <div class="thumbnails-container" bind:clientWidth={thumbnailsContainerWidth}>
            {#if thumbnailsWidth > thumbnailsContainerWidth}
                <div class="arrow" on:click={prevPhoto}>
                    <Icon name="fa-solid fa-chevron-left left-arrow" size="48"/>
                </div>
            {/if}
            <div class="thumbnails" bind:clientWidth={thumbnailsWidth}>
                {#each images as image, index}
                    <div class="thumbnail" class:active={index===photoIndex} on:click={goToPhoto.bind(this, index)}>
                        <img src={image} alt=""/>
                    </div>
                {/each}
            </div>
            {#if thumbnailsWidth > thumbnailsContainerWidth}
                <div class="arrow" on:click={nextPhoto}>
                    <Icon name="fa-solid fa-chevron-right right-arrow" size="48"/>
                </div>
            {/if}
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
        justify-content: space-between;
        align-items: center;
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
        justify-content: flex-start;
    }

    .thumbnails {
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

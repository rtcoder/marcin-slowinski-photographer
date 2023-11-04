<script lang="ts">
    import Navigation from '$lib/Navigation.svelte';
    import {onMount} from 'svelte';

    let classname = '';

    function scrollFunction() {
        classname =
            document.body.scrollTop > 50 || document.documentElement.scrollTop > 50 ? 'small' : '';
    }

    onMount(() => {
        window.onscroll = function () {
            scrollFunction();
        };
    });
</script>

<header class={classname}>
    <a href="/">
        <div class="left">
            <img src="images/profile-small.jpg" alt="logo" class="white-img"/>
            <div class="name">Marcin Słowiński</div>
        </div>
    </a>
    <Navigation/>
</header>

<style>
    header {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        color: #ffffff;
        position: sticky;
        top: 0;
        background: var(--bg_color);
        box-shadow: 0 0 1px 0 #fff;
        z-index: 2;
    }

    .left {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .name {
        justify-content: center;
        align-items: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 18px;
        overflow: hidden;
        max-width: 0;
        white-space: nowrap;
        transition: 0.5s max-width ease-in-out;
        font-weight: 100;
    }

    header.small .name {
        max-width: 300px;
    }

    img {
        border-radius: 100px;
        height: 50px;
        margin: 5px;
    }
</style>

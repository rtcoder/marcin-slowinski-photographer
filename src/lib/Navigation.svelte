<script lang="ts">
    import {page} from '$app/stores';
    import {onMount} from 'svelte';

    let hamburgerState = 'basic';
    let menuState = '';

    onMount(() => {
        document.querySelector('.hamburger').addEventListener('click', (e) => {
            menuState = menuState === 'visible' ? '' : 'visible';
            hamburgerState = hamburgerState === 'basic' ? 'cross' : 'basic';
        });

        document.querySelector('ul').addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') {
                menuState = '';
                hamburgerState = 'basic';
            }
        });
    });
</script>

<nav>
    <ul class={menuState}>
        <li class:active={$page.url.pathname === '/'}>
            <a sveltekit:prefetch href="/">Home</a>
        </li>
        <li class:active={$page.url.pathname === '/about'}>
            <a sveltekit:prefetch href="/about">O mnie</a>
        </li>
        <li class:active={$page.url.pathname === '/contact'}>
            <a sveltekit:prefetch href="/contact">Kontakt</a>
        </li>
    </ul>
    <div class="hamburger {hamburgerState}"></div>
</nav>

<style>
    nav {
        position: relative;
        z-index: 1;
    }

    .hamburger {
        width: 40px;
        position: relative;
        margin-right: 10px;
        display: none;
        cursor: pointer;
    }

    .hamburger:before,
    .hamburger:after {
        content: ' ';
        position: absolute;
        left: 0;
        width: 40px;
        height: 2px;
        background: #fff;
        transition: all 0.3s ease-in-out;
    }

    .hamburger:before {
        top: 30%;
    }

    .hamburger:after {
        top: 60%;
    }

    .hamburger.cross:before {
        top: 50%;
        transform: rotate(45deg);
    }

    .hamburger.cross:after {
        top: 50%;
        transform: rotate(-45deg);
    }

    nav,
    ul {
        display: flex;
        align-items: stretch;
        color: inherit;
    }

    li {
        margin: 5px 10px;
        background: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: inherit;
    }

    li > a {
        padding: 5px;
        border-bottom: 2px solid transparent;
    }

    li.active > a {
        border-bottom-color: var(--accent_color);
    }

    li > * {
        color: inherit;
    }

    @media (max-width: 640px) {
        .hamburger {
            display: block;
        }

        nav > ul {
            justify-content: center;
            flex-direction: column;
            position: fixed;
            right: 0;
            width: 100%;
            text-align: center;
            height: 0;
            overflow: hidden;
            background: #161616;
            transition: height 0.3s ease-in-out;
        }

        nav > ul.visible {
            height: 100vh;
        }

        li,
        li > a {
            min-height: 30px;
            flex-direction: column;
            font-size: 40px;
        }

        li {
            margin: 15px 0;
        }

        li > a {
            border-bottom-width: 3px;
        }
    }
</style>

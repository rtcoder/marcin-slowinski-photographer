<script lang="ts">
    import {page} from '$app/stores';
    import {onMount} from "svelte";

    let classname = '';
    let hamburgerState = 'basic';
    let menuState = ''

    function scrollFunction() {
        classname = (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)
            ? 'small'
            : '';
    }

    onMount(() => {
        window.onscroll = function () {
            scrollFunction()
        };

        document.querySelector('.hamburger').addEventListener('click', e => {
            menuState = menuState === 'visible' ? '' : 'visible';
            hamburgerState = hamburgerState === 'basic' ? 'cross' : 'basic';
        })

        document.querySelector('ul').addEventListener('click', e => {
            if (e.target.tagName.toLowerCase() === 'a') {
                menuState = '';
                hamburgerState = 'basic';
            }
        })
    });
</script>

<header class={classname}>
    <a href="/">
        <div class="left">
            <img src="images/profile-small.jpg" alt="logo" class="white-img">
            <div class="name">Marcin Słowiński</div>
        </div>
    </a>
    <nav>
        <ul class={menuState}>
            <li class:active={$page.path === '/'}>
                <a sveltekit:prefetch href="/">Home</a>
            </li>
            <li class:active={$page.path === '/about'}>
                <a sveltekit:prefetch href="/about">O mnie</a>
            </li>
            <li class:active={$page.path === '/contact'}>
                <a sveltekit:prefetch href="/contact">Kontakt</a>
            </li>
        </ul>
        <div class="hamburger {hamburgerState}"></div>
    </nav>
</header>


<style>
    header {
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        color: #ffffff;
        position: fixed;
        top: 0;
        background: rgba(22, 22, 22, 0.9);
        transition: all 0.3s ease-in-out;
        box-shadow: 0 0 1px 0 #fff;
        z-index: 1;
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
        transition: all 0.3s ease-in-out;
        border-radius: 100px;
        height: 70px;
        margin: 5px;
    }

    header.small img {
        height: 50px;
    }


    :global(a) {
        color: inherit;
        text-decoration: none;
    }

    header.small {
        height: 60px;
        box-shadow: 0 0 10px 0 #303030;
    }

    nav {
        position: relative;
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

    nav, ul {
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

        li, li > a {
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

        .name {
            display: flex;
        }
    }
</style>

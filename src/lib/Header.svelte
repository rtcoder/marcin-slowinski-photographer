<script lang="ts">
    import {page} from '$app/stores';
    import {onMount} from "svelte";

    export let classname: string;
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
    });
</script>

<header class={classname}>
    <img src="images/profile-small.jpg" alt="logo" class="white-img">
    <div class="name">Marcin Słowiński</div>
    <nav>
        <ul class={menuState}>
            <li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">O mnie</a></li>
            <li>
                <a sveltekit:prefetch href="/works">Realizacje</a>
                <ul>
                    <li>Sesje1</li>
                    <li>Sesje1</li>
                    <li>Sesje1</li>
                    <li>Sesje1Sesje1Sesje1Sesje1Sesje1Sesje1</li>
                </ul>
            </li>
            <li>
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
		background: #161616;
		transition: all 0.3s ease-in-out;
		box-shadow: 0 0 1px 0 #fff;
	}

	.name {
		display: none;
		justify-content: center;
		align-items: center;
		color: #cccccc;
		font-size: 20px;
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
		box-shadow: 0 0 10px 0 #414141;
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
		background: inherit;
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

	li > * {
		color: inherit;
	}

	li > ul {
		position: absolute;
		top: 100%;
		width: 100%;
		left: 0;
		max-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: all 0.3s ease-in-out;
	}

	li:hover > ul {
		max-height: 500px;
	}

	@media (max-width: 640px) {
		.hamburger {
			display: block;
		}

		nav > ul {
			flex-direction: column;
			position: fixed;
			right: 0;
			width: 100%;
			text-align: center;
			height: 0;
			overflow: hidden;
			transition: height 0.3s ease-in-out;
		}

		nav > ul.visible {
			height: 100vh;
		}

		li, li > a {
			min-height: 30px;
			flex-direction: column;
		}

		nav > ul li > ul {
			max-height: none;
			position: relative;
			top: 0;
			color: #d1d1d1;
			background: transparent;
		}

		.name {
			display: flex;
		}
	}
</style>

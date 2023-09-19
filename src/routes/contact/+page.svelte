<script>
    import Heading from '$lib/Heading.svelte';
    import Icon from '$lib/Icon.svelte';
</script>

<svelte:head>
    <title>About</title>
</svelte:head>

<section>
    <Heading>Skontaktuj się ze mną</Heading>

    <div class="contact-links">
        <a href="https://m.me/100002383642052" class="link" target="_blank">
            <div class="link-content">
                <div class="icon">
                    <Icon name="fa-brands fa-facebook-messenger"/>
                </div>
                <div class="text">m.me/100002383642052</div>
            </div>
        </a>

        <a href="tel:+48884048600" class="link" target="_blank">
            <div class="link-content">
                <div class="icon">
                    <Icon name="fa-solid fa-phone"/>
                </div>
                <div class="text">884-048-600</div>
            </div>
        </a>

        <a href="mailto:slowik669@gmail.com" class="link" target="_blank">
            <div class="link-content">
                <div class="icon">
                    <Icon name="fa-regular fa-at"/>
                </div>
                <div class="text">slowik669@gmail.com</div>
            </div>
        </a>
    </div>
</section>

<style>
    .contact-links {
        width: 100%;
        max-width: 650px;
        margin: 50px auto 0;

        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 20px 20px;
        align-items: center;
    }

    .link {
        justify-self: center;
        cursor: pointer;
    }

    .link-content {
        width: 300px;
        height: 70px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        border: 2px solid;
    }

    .link-content .icon {
        width: 70px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 2px solid;
    }

    .link-content .text {
        width: calc(100% - 70px);
        height: 70px;
        display: flex;
        align-items: center;
        padding-left: 20px;
    }

    .link:hover .link-content {
        color: var(--bg_color);
        background: var(--accent_color);
        border-color: var(--accent_color);
    }
</style>

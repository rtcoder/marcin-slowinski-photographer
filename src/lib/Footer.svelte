<script>
    import Icon from '$lib/Icon.svelte';

    const year = new Date().getFullYear();
</script>

<footer>
    <div class="copyright">© {year} Marcin Słowiński</div>
    <div class="contact">
        <a href="tel:+48884048600">
            <Icon name="fa-solid fa-phone" size="16"/>
            884-048-600
        </a>
        <a href="mailto:slowik669@gmail.com">
            <Icon name="fa-regular fa-at" size="16"/>
            slowik669@gmail.com
        </a>
    </div>
</footer>

<style>
    footer {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        padding: 10px;
        width: 100%;
        line-height: 2;
    }

    .contact {
        display: flex;
        flex-direction: column;
    }

    a:hover {
        color: var(--accent_color);
    }

    @media (max-width: 640px) {
        footer {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
    }
</style>

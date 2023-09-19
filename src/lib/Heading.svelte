<div class="heading">
    <h1>
        <slot/>
    </h1>
</div>

<style>
    .heading {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 25px;
    }

    h1 {
        position: relative;
        color: #fff;
        font-size: 30px;
        text-align: center;
    }

    h1:after {
        content: ' ';
        width: 50%;
        height: 2px;
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translate(-50%, 0);
        background: var(--accent_color);
    }

    @media (max-width: 769px) {
        h1 {
            font-size: 35px;
        }
    }

</style>

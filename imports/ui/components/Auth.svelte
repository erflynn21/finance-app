<script>
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';
    import { onMount } from 'svelte';

    let vh = 0;
    const setHeight = () => {
        vh = window.innerHeight * 1 + 'px';
    };

    window.addEventListener('resize', () => {
        setHeight();
    });

    onMount(() => {
        setHeight();
    });
</script>

<div class="container" style="min-height: {vh}; max-height: {vh};">
    <div class="intro">
        <h1>Expat Expenses</h1>
        <p>
            Expat Expenses is the easiest way to budget while living overseas
            and traveling. Over 30 major currencies are currently available
            within the app for conversion and more will be added as development
            continues. Please keep in mind: Expat Expenses is currently in the
            Beta phase of development and new features will continue to be
            added. I'd love to hear feedback and suggestions if you have any, as
            well as any issues that you encounter while using the app. Enjoy!
        </p>
    </div>
    <div class="auth">
        <BlazeTemplate template="atForm" />
    </div>
</div>

<style>
    .container {
        background-color: #eeeeeee7;
    }
    .intro {
        width: 80%;
        margin: 20px auto;
        text-align: center;
    }

    h1 {
        font-size: 30px;
        font-style: italic;
        margin-bottom: 10px;
    }

    p {
        font-size: 16px;
    }

    .auth {
        margin: 0 auto;
        width: 80%;
        text-align: center;
    }
</style>

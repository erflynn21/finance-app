<script>
    import { onMount } from 'svelte';
    import Forms from './Forms.svelte';

    let forms = false;

    const showForms = () => {
        forms = true;
    };

    const collapse = () => {
        forms = false;
    };

    let vh = 0;
    const setHeight = () => {
        vh = window.innerHeight * 1 - 115 + 'px';
        console.log(vh);
    };

    window.addEventListener('resize', () => {
        setHeight();
    });

    onMount(() => {
        setHeight();
    });
</script>

<div class="act-btn" style="top: {vh}">
    <input type="checkbox" id="toggle" on:click={showForms} />
    <label class="button" for="toggle" />
</div>

{#if forms === true}
    <div class="forms">
        <Forms on:collapse={collapse} />
    </div>
{/if}

<style>
    .act-btn {
        position: absolute;
        right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        height: 50px;
    }

    .act-btn input:not(:checked) {
        border: none;
    }
    .act-btn:focus {
        -webkit-tap-highlight-color: transparent;
    }

    .act-btn input:focus {
        -webkit-tap-highlight-color: transparent;
        outline: none;
    }

    #toggle {
        -webkit-appearance: none;
    }

    @media (pointer: course) {
        .forms {
            position: fixed;
        }
    }

    .button {
        width: 50px;
        height: 50px;
        background: green;
        border-radius: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button:before {
        position: absolute;
        content: '';
        width: 20px;
        height: 2px;
        background: #fff;
        transform: rotate(90deg);
    }

    .button:after {
        position: absolute;
        content: '';
        width: 20px;
        height: 2px;
        background: #fff;
    }
</style>

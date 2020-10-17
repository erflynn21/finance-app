<script>
    import Forms from './Forms.svelte';

    let forms = false;

    const showForms = () => {
        forms = true;
    };

    const collapse = () => {
        forms = false;
    };
</script>

<div class="act-btn">
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
        bottom: 65px;
        right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        height: 50px;
    }

    @media (pointer: coarse) {
        .act-btn {
            bottom: 180px;
        }
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

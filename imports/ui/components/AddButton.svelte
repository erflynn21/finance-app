<script>
    import Forms from './Forms.svelte';
    import { Meteor } from 'meteor/meteor';

    let forms = false;

    const showForms = () => {
        forms = true;
    };

    const collapse = () => {
        forms = false;
    };

    Meteor.subscribe('budgets');
</script>

<div class="act-btn">
    <input type="checkbox" id="toggle" on:click={showForms} />
    <label class="button" for="toggle" />
</div>

{#if forms === true}
    <div class="forms">
        <Forms on:collapse={collapse} on:recalculateExpenses />
    </div>
{/if}

<style>
    .act-btn {
        position: absolute;
        bottom: 60px;
        right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        height: 50px;
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

<script>
    import { Incomes } from '../../api/incomes.js';
    export let income;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const deleteIncome = () => {
        Incomes.remove(income._id);
        dispatch('delete', income);
    };
</script>

<div>
    {#if income.originalAmount !== null}
        <div>
            <button class="delete" on:click={deleteIncome}>X</button>
            <span>{income.title}</span>
            <span>{income.date}</span>
            <span>{income.currency}{income.amount}</span>
            <!-- <span>
                Original Amount and Currency: {income.originalCurrency}{income.originalAmount}
            </span> -->
        </div>
    {:else}
        <div>
            <button class="delete" on:click={deleteIncome}>X</button>
            <span>{income.title}</span>
            <span>{income.date}</span>
            <span>{income.currency}{income.amount}</span>
        </div>
    {/if}
</div>

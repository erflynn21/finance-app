<script>
    import { Incomes } from '../../api/incomes.js';

    export let income;

    const deleteIncome = () => {
        Incomes.remove(income._id);
    };
</script>

<div>
    {#if income.originalAmount !== null}
        <button class="delete" on:click={deleteIncome}>X</button>
        <span>{income.title}</span>
        <span>{income.date}</span>
        <span>{income.currency}{income.amount}</span>
        <!-- <span>
            Original Amount and Currency: {income.originalCurrency}{income.originalAmount}
        </span> -->
    {:else}
        <button class="delete" on:click={deleteIncome}>X</button>
        <span>{income.title}</span>
        <span>{income.date}</span>
        <span>{income.currency}{income.amount}</span>
    {/if}
</div>

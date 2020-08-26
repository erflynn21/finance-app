<script>
    import { Incomes } from '../api/incomes.js';

    export let income;

    const deleteIncome = () => {
        Incomes.remove(income._id);
    };
</script>

<div>
    {#if income.convertedAmount !== null}
        <button class="delete" on:click={deleteIncome}>X</button>
        <span>{income.title}</span>
        <span>{income.date}</span>
        <span>{income.convertedCurrency}{income.convertedAmount}</span>
        <span>
            Original Amount and Currency: {income.currency}{income.amount}
        </span>
    {:else}
        <button class="delete" on:click={deleteIncome}>X</button>
        <span>{income.title}</span>
        <span>{income.date}</span>
        <span>{income.currency}{income.amount}</span>
    {/if}
</div>

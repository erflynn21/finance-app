<script>
    import { Expenses } from '../api/expenses.js';

    export let expense;

    const deleteExpense = () => {
        Expenses.remove(expense._id);
    };
</script>

<div>
    {#if expense.convertedAmount !== null}
        <button class="delete" on:click={deleteExpense}>X</button>
        <span>{expense.title}</span>
        <span>{expense.date}</span>
        <span>{expense.convertedCurrency}{expense.convertedAmount}</span>
        <span>
            Original Amount and Currency: {expense.currency}{expense.amount}
        </span>
    {:else}
        <button class="delete" on:click={deleteExpense}>X</button>
        <span>{expense.title}</span>
        <span>{expense.date}</span>
        <span>{expense.currency}{expense.amount}</span>
    {/if}
</div>

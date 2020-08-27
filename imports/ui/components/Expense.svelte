<script>
    import { Expenses } from '../../api/expenses.js';
    export let expense;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const deleteExpense = () => {
        Expenses.remove(expense._id);
        dispatch('delete', expense);
    };
</script>

<div>
    {#if expense.originalAmount !== null}
        <button class="delete" on:click={deleteExpense}>X</button>
        <span>{expense.title}</span>
        <span>{expense.date}</span>
        <span>{expense.category}</span>
        <span>{expense.currency}{expense.amount}</span>
        <!-- <span>
                Original Amount and Currency: {expense.originalCurrency}{expense.originalAmount}
            </span> -->
    {:else}
        <button class="delete" on:click={deleteExpense}>X</button>
        <span>{expense.title}</span>
        <span>{expense.date}</span>
        <span>{expense.category}</span>
        <span>{expense.currency}{expense.amount}</span>
    {/if}
</div>

<script>
    import { Meteor } from 'meteor/meteor';
    export let expense;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const deleteExpense = () => {
        Meteor.call('expenses.remove', expense._id);
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

<script>
    import { Meteor } from 'meteor/meteor';
    import UpdateExpenseForm from './UpdateExpenseForm.svelte';
    export let expense;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const deleteExpense = () => {
        Meteor.call('expenses.remove', expense._id);
        dispatch('delete', expense);
    };

    let isHidden = true;
</script>

<div>
    <button class="delete" on:click={deleteExpense}>X</button>
    {#if expense.originalAmount !== null}
        <span>{expense.title}</span>
        <span>{expense.date}</span>
        <span>{expense.category}</span>
        <span>{expense.currency}{expense.amount}</span>

        <!-- <span>
                Original Amount and Currency: {expense.originalCurrency}{expense.originalAmount}
            </span> -->
    {:else}
        <span>{expense.title}</span>
        <span>{expense.date}</span>
        <span>{expense.category}</span>
        <span>{expense.currency}{expense.amount}</span>
    {/if}
    <div class:hidden={isHidden}>
        <UpdateExpenseForm
            {expense}
            on:collapse={() => (isHidden = !isHidden)}
            on:expenseEdited />
    </div>
    <button class="edit" on:click={() => (isHidden = !isHidden)}>Edit</button>
</div>

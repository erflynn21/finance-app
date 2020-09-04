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

<div class="expense">
    <button class="delete" on:click={deleteExpense}>
        <img src="/img/delete.svg" alt="" />
    </button>
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
    <button class="edit" on:click={() => (isHidden = !isHidden)}>
        <img src="/img/edit.svg" alt="" />
    </button>
</div>

<style>
    .expense {
        width: 100%;
    }
    .edit img {
        height: 15px;
    }

    .delete img {
        height: 20px;
    }

    button,
    button:active,
    button:visited,
    button:enabled,
    button:focus {
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        outline: 0;
        min-width: 0px;
    }
</style>

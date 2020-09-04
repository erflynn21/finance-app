<script>
    import { Meteor } from 'meteor/meteor';
    import UpdateExpenseForm from './UpdateExpenseForm.svelte';
    export let expense;
    import { createEventDispatcher } from 'svelte';
    import ListItem from '../shared/ListItem.svelte';
    let dispatch = createEventDispatcher();

    const deleteExpense = () => {
        Meteor.call('expenses.remove', expense._id);
        dispatch('delete', expense);
    };

    let isHidden = true;

    let date1 = expense.date.split('-');
    let date = date1[1] + '-' + date1[2];
</script>

<ListItem>
    <div class="expense">
        <button class="delete" on:click={deleteExpense}>
            <img src="/img/delete.svg" alt="" />
        </button>

        <time datetime={expense.date} class="date">{date}</time>
        <span class="title">{expense.title}</span>
        <!-- <span>{expense.category}</span> -->
        <span class="amount">{expense.currency}{expense.amount}</span>
        {#if expense.originalAmount !== null}
            <!-- <span>
                Original Amount and Currency: {expense.originalCurrency}{expense.originalAmount}
            </span> -->
        {/if}

        <div class:hidden={isHidden} class="update-expense">
            <UpdateExpenseForm
                {expense}
                on:collapse={() => (isHidden = !isHidden)}
                on:expenseEdited />
        </div>
        <button class="edit" on:click={() => (isHidden = !isHidden)}>
            <img src="/img/edit.svg" alt="" />
        </button>
    </div>
</ListItem>

<style>
    .expense {
        display: grid;
        grid-template-columns: 0.2fr 0.4fr 1fr 0.5fr 0.2fr;
        gap: 10px;
        justify-items: start;
        align-items: center;
        width: calc(100vw - 25px);
        margin-left: -5px;
        margin-bottom: 0;
    }

    .date {
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

    .update-expense {
        grid-column: 1/5;
        grid-row: 2;
    }
</style>

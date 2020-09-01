<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from './Expense.svelte';
    export let budget;
    export let month;
    export let year;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    let monthlyBudget = {
        month: { month },
        year: { year },
        category: budget.category,
        amount: budget.amount,
        currency: budget.currency,
    };

    $: expenses = useTracker(() => Expenses.find({}).fetch());

    $: totalExpenses = [];
    let totalExpensesIDs = [];
    const calculateTotal = (expense) => {
        if (totalExpensesIDs.includes(expense._id) === false) {
            totalExpensesIDs = [...totalExpensesIDs, expense._id];
            totalExpenses = [...totalExpenses, expense.amount];
        }
        recalculateExpenses(totalExpenses);
    };

    const updateExpenseInTotal = (expense) => {
        const index = totalExpensesIDs.indexOf(expense.detail._id);
        totalExpenses.splice(index, 1, expense.detail.amount);
        recalculateExpenses(totalExpenses);
    };

    const deleteExpenseFromTotal = (expense) => {
        const index = totalExpensesIDs.indexOf(expense.detail._id);
        totalExpenses.splice(index, 1);
        recalculateExpenses(totalExpenses);
    };

    onMount(() => {
        Meteor.subscribe('expenses');
    });

    let expensesSums = {
        sum: 0,
        id: '',
    };
    const recalculateExpenses = (totalExpenses) => {
        if (expensesSums.sum === 0) {
            expensesSums.sum = totalExpenses.reduce(function (a, b) {
                return a + b;
            }, 0);
            expensesSums.id = budget._id;
        } else {
            expensesSums.sum = totalExpenses.reduce(function (a, b) {
                return a + b;
            }, 0);
            expensesSums.id = budget._id;
        }

        dispatch('recalculateExpenses', { data: expensesSums });
    };
</script>

<span>{budget.category} --</span>
<span>Budgeted: {budget.amount}</span>
<span>Spent: {expensesSums.sum}</span>
<br />
{#each $expenses as expense (expense._id)}
    {#if expense.category === budget.category}
        <Expense
            {expense}
            on:delete={deleteExpenseFromTotal}
            on:expenseEdited={updateExpenseInTotal} />
        {#each [calculateTotal(expense)] as expense}
            <div />
        {/each}
    {/if}
{/each}
<br />

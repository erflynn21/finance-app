<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from './Expense.svelte';
    export let budget;

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

    const deleteExpenseFromTotal = (expense) => {
        const index = totalExpensesIDs.indexOf(expense._id);
        totalExpenses.splice(index, 1);
        totalExpenses = totalExpenses;
        recalculateExpenses(totalExpenses);
    };

    onMount(() => {
        Meteor.subscribe('expenses');
    });

    $: expenseSum = 0;
    const recalculateExpenses = (totalExpenses) => {
        expenseSum = totalExpenses.reduce(function (a, b) {
            return a + b;
        }, 0);
    };
</script>

<span>{budget.category} --</span>
<span>Budgeted: {budget.amount}</span>
<span>Spent: {expenseSum}</span>
<br />
{#each $expenses as expense (expense._id)}
    {#if expense.category === budget.category}
        {#each [calculateTotal(expense)] as expense}
            <div />
        {/each}
        <Expense {expense} on:delete={deleteExpenseFromTotal} />
    {/if}
{/each}
<br />

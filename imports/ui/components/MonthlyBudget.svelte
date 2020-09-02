<script>
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import MonthlyBudgetCategory from './MonthlyBudgetCategory.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { Expenses } from '../../api/expenses';

    // getting budget and expense info
    $: baseBudgets = useTracker(() => Budgets.find({}).fetch());

    $: expenseSum = 0;
    const calculateExpenses = () => {
        let totalExpenses = Expenses.find({}).fetch();
        let expenses = [];
        totalExpenses.forEach((expense) => {
            expenses = [...expenses, expense.amount];
        });
        expenseSum = expenses.reduce(function (a, b) {
            return a + b;
        }, 0);
        expenseSumStore.set(expenseSum);
    };

    // setting budget month
    const date = new Date();
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    onMount(() => {
        Meteor.subscribe('expenses', function () {
            calculateExpenses();
        });
    });
</script>

<div class="monthly-overview">
    <h1>{month} {year}</h1>
    {#each $baseBudgets as budget (budget._id)}
        <MonthlyBudgetCategory
            {budget}
            {month}
            {year}
            on:calculate={calculateExpenses} />
    {/each}
    <h3>Total Expenses: {$expenseSumStore}</h3>
</div>

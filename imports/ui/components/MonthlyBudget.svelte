<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { onMount } from 'svelte';
    import { Budgets } from '../../api/budgets';
    import MonthlyBudgetCategory from './MonthlyBudgetCategory.svelte';

    // getting budget and expense info
    $: baseBudgets = useTracker(() => Budgets.find({}).fetch());

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

    $: totalExpenseSums = [];
    let expenseSumIDs = [];
    $: expensesSum = 0;
    const recalculateExpenses = (expensesSums) => {
        const sum = expensesSums.detail.data.sum;
        const id = expensesSums.detail.data.id;
        if (expenseSumIDs.includes(id) === true) {
            const index = expenseSumIDs.indexOf(id);
            expenseSumIDs.splice(index, 1);
            totalExpenseSums.splice(index, 1);
            totalExpenseSums = totalExpenseSums;
        }
        expenseSumIDs = [...expenseSumIDs, id];
        totalExpenseSums = [...totalExpenseSums, sum];
        expensesSum = totalExpenseSums.reduce(function (a, b) {
            return a + b;
        }, 0);
    };
</script>

<div class="monthly-overview">
    <h1>{month} {year}</h1>
    {#each $baseBudgets as budget (budget._id)}
        <MonthlyBudgetCategory
            {budget}
            {month}
            {year}
            on:recalculateExpenses={recalculateExpenses} />
    {/each}
    <h3>Total Expenses: {expensesSum}</h3>
</div>

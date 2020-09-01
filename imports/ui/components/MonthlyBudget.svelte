<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import MonthlyBudgetCategory from './MonthlyBudgetCategory.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';

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
</script>

<div class="monthly-overview">
    <h1>{month} {year}</h1>
    {#each $baseBudgets as budget (budget._id)}
        <MonthlyBudgetCategory {budget} {month} {year} on:recalculateExpenses />
    {/each}
    <h3>Total Expenses: {$expenseSumStore}</h3>
</div>

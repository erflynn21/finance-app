<script>
    import ExpenseList from './ExpenseList.svelte';
    import IncomeList from './IncomeList.svelte';
    import {
        expenseSumStore,
        incomeSumStore,
        userCurrencySymbol,
    } from '../stores/stores';
    import Heading from '../shared/Heading.svelte';

    $: remainingTotal = Number(($incomeSumStore - $expenseSumStore).toFixed(2));
</script>

<div class="container">
    <Heading>Transactions</Heading>
    <div>
        <!-- List of expenses -->
        <h1>Expenses:</h1>
        <h3>Total Expenses: {$userCurrencySymbol}{$expenseSumStore}</h3>
        <ExpenseList />
        <!-- List of incomes -->
        <h1>Income:</h1>
        <h3>Total Income: {$userCurrencySymbol}{$incomeSumStore}</h3>
        <IncomeList />
        <h3>Remaining: {$userCurrencySymbol}{remainingTotal}</h3>
    </div>
</div>

<style>
    h1 {
        font-size: 16px;
        color: black;
        font-weight: 500;
        text-align: center;
        margin: 10px 0;
    }

    h3 {
        font-size: 14px;
        color: black;
        font-weight: 400;
        text-align: center;
        margin: 10px 0;
    }

    .container {
        margin-bottom: 60px;
    }
</style>
